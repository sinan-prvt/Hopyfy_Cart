from rest_framework import viewsets, generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Category, Product, Cart, Wishlist, Order, OrderItem, Review, ProductImage
from .serializers import (
    UserSerializer, RegisterSerializer, CategorySerializer, ProductSerializer,
    CartSerializer, WishlistSerializer, OrderSerializer, ReviewSerializer, AdminCreateUserSerializer
)
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.viewsets import ModelViewSet
from django.conf import settings
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import default_token_generator
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from rest_framework.permissions import AllowAny
import razorpay 
from datetime import timedelta
import random
from django.utils import timezone

User = get_user_model()


class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user.is_active = True
        user.is_verified = True
        user.save()

        refresh = RefreshToken.for_user(user)
        data = {
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
        headers = self.get_success_headers(serializer.data)

        from django.conf import settings
        from django.template.loader import render_to_string
        from django.core.mail import EmailMultiAlternatives

        site_url = "http://localhost:5173"
        subject = "Welcome to Hopyfy Cart!"
        from_email = settings.DEFAULT_FROM_EMAIL
        to = [user.email]

        html_content = render_to_string(
            "emails/verify_email.html",
            {"user": user, "site_url": site_url}
        )
        text_content = f"Hi {user.username}, welcome to Hopyfy Cart! Your registration was successful. Visit us at {site_url}"

        try:
            msg = EmailMultiAlternatives(subject, text_content, from_email, to)
            msg.attach_alternative(html_content, "text/html")
            msg.send(fail_silently=False)
        except Exception as e:
            print("⚠️ Email sending failed:", e)

        return Response(
            {
                "detail": "User created successfully. Welcome email sent.",
                "data": data
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )

otp_storage = {}

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()

        if user:
            otp = random.randint(100000, 999999)
            otp_storage[email] = {
                "otp": str(otp),
                "expires_at": timezone.now() + timedelta(minutes=5)
            }

            send_mail(
                "Your Password Reset OTP",
                f"Your OTP for password reset is {otp}. It will expire in 5 minutes.",
                "no-reply@example.com",
                [email],
            )

        return Response(
            {"message": "If this email exists, an OTP has been sent."},
            status=status.HTTP_200_OK
        )

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        new_password = request.data.get("password")

        if not (email and otp and new_password):
            return Response({"error": "Email, OTP, and password are required"}, status=400)

        otp_entry = otp_storage.get(email)
        if not otp_entry:
            return Response({"error": "OTP not found or expired"}, status=400)

        if timezone.now() > otp_entry["expires_at"]:
            del otp_storage[email]
            return Response({"error": "OTP expired"}, status=400)

        if otp_entry["otp"] != str(otp):
            return Response({"error": "Invalid OTP"}, status=400)

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User not found"}, status=400)

        user.set_password(new_password)
        user.save()

        del otp_storage[email]

        return Response({"success": "Password reset successful"}, status=200)
    
class EmailTokenObtainSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")

        if not user.check_password(password):
            raise serializers.ValidationError("Wrong Credentials")

        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }

class EmailTokenObtainView(generics.GenericAPIView):
    serializer_class = EmailTokenObtainSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'

    @action(detail=True, methods=['patch'])
    def block_user(self, request, id=None):
        user = self.get_object()
        user.isBlock = True
        user.save()
        return Response({'isBlock': user.isBlock})

    @action(detail=True, methods=['patch'])
    def unblock_user(self, request, id=None):
        user = self.get_object()
        user.isBlock = False
        user.save()
        return Response({'isBlock': user.isBlock})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

class CustomLoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "token": token.key,
            "user": {
                "id": user.id,
                "email": user.email,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
                "username": user.username
            }
        })

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (permissions.AllowAny,)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
    
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category').all().order_by('-created_at')
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = super().get_queryset()
        cat = self.request.query_params.get('category')
        if cat:
            if cat.isnumeric():
                qs = qs.filter(category__id=cat)
            else:
                qs = qs.filter(category__name__icontains=cat)
        return qs
    
class ReviewListAPIView(generics.ListAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        product_id = self.request.query_params.get('product')
        if product_id:
            return Review.objects.filter(product_id=product_id).order_by('-created_at')
        return Review.objects.none()

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    def create(self, request, *args, **kwargs):
        product = get_object_or_404(Product, pk=request.data.get('product_id'))
        qty = int(request.data.get('quantity', 1))
        cart_item, created = Cart.objects.get_or_create(
            user=request.user,
            product=product,
            defaults={'quantity': qty}
        )
        if not created:
            cart_item.quantity += qty
            cart_item.save()
        return Response(CartSerializer(cart_item).data, status=status.HTTP_201_CREATED)


    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        quantity = int(request.data.get('quantity', instance.quantity))

        if quantity < 1:
            return Response({"detail": "Quantity must be at least 1"}, status=status.HTTP_400_BAD_REQUEST)

        if quantity > instance.product.stock:
            return Response({"detail": f"Only {instance.product.stock} items available"}, status=status.HTTP_400_BAD_REQUEST)

        instance.quantity = quantity
        instance.save()
        return Response(CartSerializer(instance).data)

    def perform_destroy(self, instance):
        instance.delete()

    @action(detail=False, methods=['post'])
    def clear(self, request):
        deleted_count, _ = Cart.objects.filter(user=request.user).delete()
        return Response({"detail": f"Cart cleared ({deleted_count} items removed)"}, status=status.HTTP_200_OK)
    
class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).select_related('product')

    def create(self, request, *args, **kwargs):
        product = get_object_or_404(Product, pk=request.data.get('product_id'))
        obj, created = Wishlist.objects.get_or_create(user=request.user, product=product)
        return Response(WishlistSerializer(obj).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def move_to_cart(self, request):
        product = get_object_or_404(Product, pk=request.data.get('product_id'))
        qty = int(request.data.get('quantity', 1))

        Wishlist.objects.filter(user=request.user, product=product).delete()

        cart_item, created = Cart.objects.get_or_create(
            user=request.user,
            product=product,
            defaults={'quantity': qty}
        )
        if not created:
            cart_item.quantity += qty
            cart_item.save()

        serializer = CartSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['delete'], url_path='remove_by_product/(?P<product_id>[^/.]+)')
    def remove_by_product(self, request, product_id=None):
        obj = get_object_or_404(Wishlist, user=request.user, product__id=product_id)
        obj.delete()
        return Response({"detail": "Removed from wishlist"}, status=status.HTTP_200_OK)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        qs = Order.objects.filter(user=self.request.user).prefetch_related('items__product').order_by('-created_at')
        if self.request.user.is_staff:
            qs = Order.objects.all().prefetch_related('items__product').order_by('-created_at')
        return qs

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status.lower() not in ["pending", "processing"]:
            return Response({"detail": "Cannot cancel this order."}, status=status.HTTP_400_BAD_REQUEST)
        order.status = "cancelled"
        order.save()
        return Response({"status": "cancelled"})

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_razorpay_order(request):
    user = request.user
    cart_items = Cart.objects.filter(user=user)
    if not cart_items.exists():
        return Response({"detail": "Cart is empty"}, status=400)

    amount = sum(item.product.price * item.quantity for item in cart_items)
    amount_in_paise = int(amount * 100)

    razorpay_order = client.order.create({
        "amount": amount_in_paise,
        "currency": "INR",
        "payment_capture": "1"
    })

    order = Order.objects.create(
        user=user,
        total_amount=amount,
        payment_method="RAZORPAY",
        status="pending",
        razorpay_order_id=razorpay_order['id']
    )

    # Create OrderItems from cart
    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price
        )

    return Response({
        "key": settings.RAZORPAY_KEY_ID,
        "razorpay_order_id": razorpay_order['id'],
        "amount": amount_in_paise,
        "currency": "INR",
        "order_id": order.id
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_razorpay_payment(request):
    from razorpay.errors import SignatureVerificationError

    data = request.data
    order_id = data.get("order_id")
    razorpay_payment_id = data.get("razorpay_payment_id")
    razorpay_signature = data.get("razorpay_signature")

    if not all([order_id, razorpay_payment_id, razorpay_signature]):
        return Response({"success": False, "detail": "Missing payment data"}, status=400)

    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"success": False, "detail": "Order not found"}, status=404)

    params_dict = {
        'razorpay_order_id': order.razorpay_order_id,
        'razorpay_payment_id': razorpay_payment_id,
        'razorpay_signature': razorpay_signature
    }

    try:
        client.utility.verify_payment_signature(params_dict)

        order.razorpay_payment_id = razorpay_payment_id
        order.razorpay_signature = razorpay_signature
        order.status = "Paid"
        order.save()

        Cart.objects.filter(user=request.user).delete()

        return Response({"success": True, "detail": "Payment verified and order updated"})

    except SignatureVerificationError:
        order.status = "Failed"
        order.save()
        return Response({"success": False, "detail": "Payment verification failed"}, status=400)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def checkout(request):
    user = request.user
    payment_method = request.data.get('payment_method', 'COD')
    cart_items = Cart.objects.filter(user=user).select_related('product')

    if not cart_items.exists():
        return Response({"detail": "Cart empty"}, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        total = 0
        for item in cart_items:
            if item.product.stock < item.quantity:
                return Response({"detail": f"Insufficient stock for {item.product.name}"}, status=status.HTTP_400_BAD_REQUEST)
            total += item.product.price * item.quantity

        order = Order.objects.create(user=user, total_amount=total, payment_method=payment_method, status='Pending')

        for item in cart_items:
            OrderItem.objects.create(order=order, product=item.product, quantity=item.quantity, price=item.product.price)
            item.product.stock -= item.quantity
            item.product.save()

        cart_items.delete()

    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category').all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]

    def create(self, request, *args, **kwargs):
        data = request.data
        product = Product.objects.create(
            name=data.get('name'),
            brand=data.get('brand', ''),
            description=data.get('description', ''),
            price=data.get('price'),
            stock=data.get('stock'),
            category_id=data.get('category')
        )

        for f in request.FILES.getlist('image'):
            ProductImage.objects.create(product=product, image=f)

        for img_url in request.data.getlist('image_url'):
            ProductImage.objects.create(product=product, image_url=img_url)

        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]

class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().prefetch_related('items__product')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]

    def partial_update(self, request, *args, **kwargs):
        order = self.get_object()
        status = request.data.get('status', '').lower()

        valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]
        if status in valid_statuses:
            order.status = status
            order.save()
            return Response(OrderSerializer(order).data)
        return Response({"detail": "Invalid status"}, status=400)
    
class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'create':
            return AdminCreateUserSerializer
        return UserSerializer

    @action(detail=True, methods=['patch'])
    def block_user(self, request, pk=None):
        user = self.get_object()
        user.isBlock = True
        user.save()
        return Response(UserSerializer(user).data)

    @action(detail=True, methods=['patch'])
    def unblock_user(self, request, pk=None):
        user = self.get_object()
        user.isBlock = False
        user.save()
        return Response(UserSerializer(user).data)

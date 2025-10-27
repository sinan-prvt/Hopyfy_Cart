from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterAPIView, EmailTokenObtainView,
    CategoryViewSet, ProductViewSet,
    CartViewSet, WishlistViewSet, OrderViewSet,
    checkout, ReviewViewSet, UserViewSet, AdminProductViewSet, AdminCategoryViewSet, AdminOrderViewSet,
    AdminUserViewSet, PasswordResetRequestView, PasswordResetConfirmView
)
from .views import current_user
from . import views

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('products', ProductViewSet, basename='product')
router.register('cart', CartViewSet, basename='cart')
router.register('wishlist', WishlistViewSet, basename='wishlist')
router.register('orders', OrderViewSet, basename='order')
router.register('reviews', ReviewViewSet, basename='review')
router.register('users', UserViewSet, basename='user')

router.register('admin/products', AdminProductViewSet, basename='admin-product')
router.register('admin/categories', AdminCategoryViewSet, basename='admin-category')
router.register('admin/orders', AdminOrderViewSet, basename='admin-order')
router.register('admin/users', AdminUserViewSet, basename='admin-user')



urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterAPIView.as_view(), name='register'),
    path('auth/login/', EmailTokenObtainView.as_view(), name='email_token_obtain'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('checkout/', checkout, name='checkout'),
    path("auth/user/", current_user, name="current_user"),
    path('auth/token/', EmailTokenObtainView.as_view(), name='token_obtain'),
    path("auth/password-reset/", PasswordResetRequestView.as_view(), name="password_reset"),
    path("auth/password-reset-confirm/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path('razorpay/order/', views.create_razorpay_order, name='create_razorpay_order'),
    path('razorpay/verify-payment/', views.verify_razorpay_payment, name='verify_payment'),

]

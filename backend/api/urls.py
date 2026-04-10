from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomersViewSet, InventoryViewSet, InvoiceItemsViewSet, 
    InvoicesViewSet, OrdersViewSet, PaymentsViewSet, 
    SettingsViewSet, StaffViewSet
)

router = DefaultRouter()
router.register(r'customers', CustomersViewSet)
router.register(r'inventory', InventoryViewSet)
router.register(r'invoice-items', InvoiceItemsViewSet)
router.register(r'invoices', InvoicesViewSet)
router.register(r'orders', OrdersViewSet)
router.register(r'payments', PaymentsViewSet)
router.register(r'settings', SettingsViewSet)
router.register(r'staff', StaffViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

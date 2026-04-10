from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Customers, Inventory, InvoiceItems, Invoices, Orders, Payments, Settings, Staff
from .serializers import (
    CustomersSerializer, InventorySerializer, InvoiceItemsSerializer, 
    InvoicesSerializer, OrdersSerializer, PaymentsSerializer, 
    SettingsSerializer, StaffSerializer
)

class CustomersViewSet(viewsets.ModelViewSet):
    queryset = Customers.objects.all().order_by('id')
    serializer_class = CustomersSerializer

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all().order_by('id')
    serializer_class = InventorySerializer

class InvoiceItemsViewSet(viewsets.ModelViewSet):
    queryset = InvoiceItems.objects.all().order_by('id')
    serializer_class = InvoiceItemsSerializer

class InvoicesViewSet(viewsets.ModelViewSet):
    queryset = Invoices.objects.all().order_by('-date')
    serializer_class = InvoicesSerializer

class OrdersViewSet(viewsets.ModelViewSet):
    queryset = Orders.objects.all().order_by('-date')
    serializer_class = OrdersSerializer

class PaymentsViewSet(viewsets.ModelViewSet):
    queryset = Payments.objects.all().order_by('id')
    serializer_class = PaymentsSerializer

class SettingsViewSet(viewsets.ModelViewSet):
    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer

    def create(self, request, *args, **kwargs):
        # Normalize camelCase to snake_case if sent from frontend
        data = request.data.copy()
        if 'businessName' in data and 'business_name' not in data:
            data['business_name'] = data.pop('businessName')
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        # Normalize camelCase to snake_case if sent from frontend
        data = request.data.copy()
        if 'businessName' in data and 'business_name' not in data:
            data['business_name'] = data.pop('businessName')
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all().order_by('id')
    serializer_class = StaffSerializer

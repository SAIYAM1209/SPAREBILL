from rest_framework import serializers
from .models import Customers, Inventory, InvoiceItems, Invoices, Orders, Payments, Settings, Staff




class CustomersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customers
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = '__all__'

class InvoiceItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItems
        fields = '__all__'

class PaymentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payments
        fields = '__all__'

class InvoicesSerializer(serializers.ModelSerializer):
    items = InvoiceItemsSerializer(source='invoiceitems_set', many=True, read_only=True)
    payment = PaymentsSerializer(source='payments', read_only=True)

    class Meta:
        model = Invoices
        fields = '__all__'

class OrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = '__all__'

class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = '__all__'

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'

from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.db import connection
from .models import Inventory, Customers, Staff, Payments, InvoiceItems

def reset_sequence(table_name):
    """
    Resets the PostgreSQL auto-increment sequence for a given table
    to the current maximum ID + 1. If the table is empty, resets to 1.
    """
    with connection.cursor() as cursor:
        try:
            # Find the sequence associated with the 'id' column
            cursor.execute(f"SELECT pg_get_serial_sequence('{table_name}', 'id')")
            result = cursor.fetchone()
            if result and result[0]:
                seq_name = result[0]
                # Reset sequence to MAX(id). Note: is_called=false means the NEXT value will be exactly the number provided.
                cursor.execute(f"SELECT setval('{seq_name}', COALESCE((SELECT MAX(id) FROM {table_name}), 0) + 1, false)")
        except Exception as e:
            # Log error but don't crash the delete operation
            print(f"Error resetting sequence for {table_name}: {e}")

@receiver(post_delete, sender=Inventory)
def on_inventory_delete(sender, instance, **kwargs):
    reset_sequence('inventory')

@receiver(post_delete, sender=Customers)
def on_customers_delete(sender, instance, **kwargs):
    reset_sequence('customers')

@receiver(post_delete, sender=Staff)
def on_staff_delete(sender, instance, **kwargs):
    reset_sequence('staff')

@receiver(post_delete, sender=Payments)
def on_payments_delete(sender, instance, **kwargs):
    reset_sequence('payments')

@receiver(post_delete, sender=InvoiceItems)
def on_invoice_items_delete(sender, instance, **kwargs):
    reset_sequence('invoice_items')

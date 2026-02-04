from django.contrib import admin
from .models import Job, Application
from django.utils.timezone import now


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'company',
        'location',
        'is_active',
        'expiry_date',
        'created_at'
    )

    list_filter = ('is_active', 'location', 'company')
    search_fields = ('title', 'company', 'location')
    ordering = ('-created_at',)
    list_editable = ('is_active',)

    actions = ['mark_expired']

    def mark_expired(self, request, queryset):
        queryset.update(is_active=False)
    mark_expired.short_description = "Mark selected jobs as expired"


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('job', 'applicant', 'applied_at')
    list_filter = ('job',)
    search_fields = ('applicant__username', 'job__title')

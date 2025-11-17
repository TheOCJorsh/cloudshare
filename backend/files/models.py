from django.db import models
from django.contrib.auth.models import User

class File(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='uploads/')
    file_name = models.CharField(max_length=255)
    size = models.PositiveIntegerField(editable=False, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.file:
            self.size = self.file.size
            if not self.file_name:
                self.file_name = self.file.name
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.file_name} ({self.owner.username})"

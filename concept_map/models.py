from django.db import models

# Create your models here.


class Node(models.Model):
    text = models.CharField(max_length=256, default="")
    connections = models.ManyToManyField("self", blank=True)

    def __str__(self):
        return self.text

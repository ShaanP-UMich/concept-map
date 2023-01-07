from django.db import models

# Create your models here.


class Node(models.Model):
    text = models.CharField(max_length=256, default="")
    category = models.CharField(max_length=50, default="Idea")

    def __str__(self):
        return self.text


class Relationship(models.Model):
    from_node = models.ForeignKey(
        Node, null=False, related_name='from_node', on_delete=models.CASCADE)
    to_node = models.ForeignKey(
        Node, null=False, related_name='to_node', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.from_node.text} to {self.to_node.text}"

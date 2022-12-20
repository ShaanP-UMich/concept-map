from django.db import models

# Create your models here.


class Node(models.Model):
    text = models.CharField(max_length=256, default="")
    connections = models.ManyToManyField("self", blank=True)

    def __str__(self):
        return self.text


# class Relationship(models.Model):
#     # node_from = models.IntegerField(null=False)
#     # node_to = models.IntegerField(null=False)
#     # (node_from, node_to) = models.AutoField(primary_key=True)
#     start_node = models.ForeignKey(Node, on_delete=models.CASCADE)
#     end_node = models.ForeignKey(Node, on_delete=models.CASCADE)

#     # def __str__(self):
#     #     return f"{self.node_from} to {self.node_to}"

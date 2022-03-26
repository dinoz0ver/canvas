from PIL import Image
import sys

s = input("Введите имя файла: ")

img=Image.open(s).convert("RGBA")
data = map(lambda x: list(x), img.getdata())
print(list(data))
print(img.size)

input("Нажмите любую кнопку чтобы закончить программу")
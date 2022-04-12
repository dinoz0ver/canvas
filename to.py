from PIL import Image
import sys

s = input("Введите имя файла: ")

img=Image.open(s).convert("RGBA")
data = map(lambda x: list(x), img.getdata())
with open(f"{s}.js", "w") as f:
	f.write(f"var NAME={list(data)};")
	f.write(f"var NAME_SIZE={img.size};")
# print(list(data))
# print(img.size)

input("Нажмите любую кнопку чтобы закончить программу")
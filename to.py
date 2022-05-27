from PIL import Image
import sys
while True:
	s = input("Введите имя файла: ")

	img=Image.open(s).convert("RGBA")
	data = map(lambda x: list(x), img.getdata())
	name=s.split(".")[0]
	with open(f"assets/{name}.js", "w") as f:
		f.write(f"var {name.upper()}={list(data)};\n")
		f.write(f"var {name.upper()}_SIZE={{width:{img.size[0]}, height:{img.size[1]}}};")
	print("Завершено")
input("Нажмите любую кнопку чтобы закончить программу")

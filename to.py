from PIL import Image
import sys

img=Image.open(sys.argv[1]).convert("RGBA")
data = map(lambda x: list(x), img.getdata())
print(list(data))
print(img.size)

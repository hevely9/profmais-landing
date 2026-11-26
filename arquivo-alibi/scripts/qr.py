# gera o QR code (SVG) que aponta para a Central com o código do caso
import sys, qrcode, qrcode.image.svg
url, saida = sys.argv[1], sys.argv[2]
img = qrcode.make(url, image_factory=qrcode.image.svg.SvgPathImage, box_size=10, border=2)
img.save(saida)

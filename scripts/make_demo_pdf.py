# -*- coding: utf-8 -*-
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


def first(paths):
    for p in paths:
        if os.path.exists(p):
            return p
    return paths[-1]


pdfmetrics.registerFont(TTFont("Body", first(["C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/arial.ttf"])))
pdfmetrics.registerFont(TTFont("Bold", first(["C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf"])))

ACCENT = HexColor("#234E70")
GRAPHITE = HexColor("#1A1A1A")
MUTED = HexColor("#6B6B6B")
LINE = HexColor("#ECE9E2")

st_cover = ParagraphStyle("cover", fontName="Bold", fontSize=40, textColor=ACCENT, leading=42)
st_coversub = ParagraphStyle("coversub", fontName="Body", fontSize=13, textColor=MUTED, leading=18, spaceBefore=6)
st_meta = ParagraphStyle("meta", fontName="Body", fontSize=9, textColor=MUTED, leading=13)
st_intro = ParagraphStyle("intro", fontName="Body", fontSize=10.5, textColor=GRAPHITE, leading=16, spaceBefore=4)
st_h = ParagraphStyle("h", fontName="Bold", fontSize=15, textColor=ACCENT, leading=19, spaceAfter=8)
st_cap = ParagraphStyle("cap", fontName="Body", fontSize=10, textColor=MUTED, leading=14.5, spaceBefore=8)

SHOTS = "docs/shots"
CONTENT_W = 178 * mm
MAX_H = 226 * mm

screens = [
    ("01-home.png", "1. Главная: витрина + Топ магазинов",
     "Категории, лента «Топ магазинов» (промо/рейтинг) и рекомендации. <b>ТЗ §1, §4</b> + продвижение магазинов."),
    ("02-shops.png", "2. Топ магазинов площадки",
     "Рейтинг «по версии Волги», места #1…, бейдж «Промо». Мотивация роста; в перспективе — платное размещение и аукцион. <b>Новое</b>."),
    ("03-catalog.png", "3. Каталог",
     "Категории-чипы, фильтры (поиск, особенности, город), сортировка. <b>ТЗ §4</b>."),
    ("04-product-toy.png", "4. Карточка — маленький магазин",
     "Состав, ручная работа, кол-во / «под заказ», самовывоз, возврат, уход. <b>ТЗ §5</b> (по фото клиента)."),
    ("05-product-table.png", "5. Карточка — производство: прослеживаемость",
     "«Состав и происхождение» со ссылками на поставщиков (дуб, эпоксидная смола), экспорт, адрес. <b>Ключевая функция из голосовых.</b>"),
    ("06-product-supplier.png", "6. Поставщик сырья",
     "«Применение» (что можно изготовить), «Производство», экспорт. Связка поставщик ↔ производитель. <b>Новое</b>."),
    ("07-cart.png", "7. Корзина",
     "Позиции с вариантами, количество, пересчёт суммы. <b>ТЗ §4</b>."),
    ("08-checkout.png", "8. Оформление заказа",
     "Контакты, доставка/самовывоз, оплата (карта / СБП / кошелёк / при получении), эскроу. <b>ТЗ §4</b>."),
    ("09-account.png", "9. Кабинет покупателя",
     "Заказы со статусами, эскроу, трек, избранное, отзывы, чат. <b>ТЗ §3, §4</b>."),
    ("10-seller.png", "10. Кабинет продавца",
     "Статистика, добавление товара → модерация, смена статусов заказов, сотрудники. <b>ТЗ §3, §4</b>."),
    ("11-admin.png", "11. Админ-панель",
     "Дашборд, модерация (одобрить/отклонить), споры и арбитраж, пользователи, финансы, аудит-лог. <b>ТЗ §3, §4</b>."),
    ("12-login.png", "12. Роли и вход",
     "Рабочий вход/регистрация и карточки всех 7 ролей платформы. <b>ТЗ §3</b>."),
]


def framed(path):
    iw, ih = ImageReader(path).getSize()
    scale = min(CONTENT_W / iw, MAX_H / ih)
    w, h = iw * scale, ih * scale
    im = Image(path, width=w, height=h)
    t = Table([[im]], colWidths=[w])
    t.hAlign = "CENTER"
    t.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.75, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return t


story = []
story.append(Spacer(1, 38 * mm))
story.append(Paragraph("Волга", st_cover))
story.append(Paragraph("Маркетплейс изделий ручной работы и российского производства", st_coversub))
story.append(Spacer(1, 8))
story.append(HRFlowable(width="100%", thickness=2, color=ACCENT, spaceAfter=4))
story.append(Paragraph("Демонстрация работоспособности по ТЗ · 12 экранов · 23.05.2026", st_meta))
story.append(Spacer(1, 16))
story.append(Paragraph(
    "Живые экраны площадки (десктоп). Реализованы все пункты ТЗ §1–§5, роли и кабинеты, "
    "модерация, споры, эскроу и статусы заказов.", st_intro))
story.append(Paragraph(
    "Новое в этой версии: <b>Топ магазинов</b> (лента + рейтинг + промо), "
    "<b>прослеживаемость материалов</b> со ссылками на поставщиков, <b>поставщики сырья</b> "
    "с «применением» и экспортом, новые категории (мебель, сырьё).", st_intro))
story.append(Paragraph(
    "Что симулируется и требует внешних ключей (онлайн-оплата ЮKassa, API логистики СДЭК, "
    "хэш-авторизация, антифрод) — см. «ТЗ-Волга.pdf», раздел 9.", st_intro))

for img, title, cap in screens:
    path = os.path.join(SHOTS, img)
    if not os.path.exists(path):
        continue
    story.append(PageBreak())
    story.append(Paragraph(title, st_h))
    story.append(framed(path))
    story.append(Paragraph(cap, st_cap))

doc = SimpleDocTemplate(
    os.path.join("docs", "Волга-демо.pdf"),
    pagesize=A4,
    leftMargin=16 * mm, rightMargin=16 * mm, topMargin=16 * mm, bottomMargin=14 * mm,
    title="Волга — демонстрация по ТЗ", author="Волга",
)
doc.build(story)

out = os.path.join(os.getcwd(), "docs", "Волга-демо.pdf")
print("OK:", os.path.getsize(out), "bytes,", len(screens), "screens")

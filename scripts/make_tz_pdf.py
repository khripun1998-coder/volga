# -*- coding: utf-8 -*-
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
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
pdfmetrics.registerFontFamily("UI", normal="Body", bold="Bold", italic="Body", boldItalic="Bold")

ACCENT = HexColor("#234E70")
GRAPHITE = HexColor("#1A1A1A")
MUTED = HexColor("#6B6B6B")
LINE = HexColor("#ECE9E2")
CREAM = HexColor("#FAF8F4")
SOFT = HexColor("#EEF2F6")
SAGE = HexColor("#4F7A63")
AMBER = HexColor("#B45309")

st_title = ParagraphStyle("title", fontName="Bold", fontSize=30, textColor=ACCENT, leading=32)
st_sub = ParagraphStyle("sub", fontName="Body", fontSize=11.5, textColor=MUTED, leading=16, spaceBefore=4)
st_meta = ParagraphStyle("meta", fontName="Body", fontSize=8.5, textColor=MUTED, leading=12)
st_h2 = ParagraphStyle("h2", fontName="Bold", fontSize=12.5, textColor=ACCENT, leading=16, spaceBefore=13, spaceAfter=5)
st_body = ParagraphStyle("body", fontName="Body", fontSize=10, textColor=GRAPHITE, leading=15)
st_bul = ParagraphStyle("bul", fontName="Body", fontSize=10, textColor=GRAPHITE, leading=14.5,
                        leftIndent=12, bulletIndent=0, bulletColor=ACCENT, spaceAfter=2)
st_ok = ParagraphStyle("ok", parent=st_bul, bulletColor=SAGE)
st_sim = ParagraphStyle("sim", parent=st_bul, bulletColor=AMBER, textColor=HexColor("#3f3a33"))

story = []


def h2(t):
    story.append(Paragraph(t, st_h2))


def b(t, style=st_bul):
    story.append(Paragraph(t, style, bulletText="▪"))


# ── Шапка ──
story.append(Paragraph("Волга", st_title))
story.append(Paragraph("Маркетплейс изделий ручной работы и российского производства", st_sub))
story.append(Spacer(1, 7))
story.append(HRFlowable(width="100%", thickness=2, color=ACCENT, spaceAfter=3))
story.append(Paragraph("Техническое задание · ключевые факты · обновлено 23.05.2026", st_meta))

# ── 1 ──
h2("1. О проекте")
b("Площадка, объединяющая независимых продавцов (мастеров, локальных производителей) и покупателей.")
b("Платформа сама не продаёт — даёт инфраструктуру (витрина, заказы, расчёты, доверие); зарабатывает на комиссии и подписке.")
b("Ниша: изделия ручной работы и товары РФ — ярлыки «Ручная работа», «Сделано в России», «Эко». Аналоги: Etsy + Ozon/Wildberries в премиальном исполнении.")
b("Аудитория: покупатели (частные лица) и продавцы (мастера, самозанятые, ИП, юрлица).")
b("Язык — русский, валюта — рубль (₽).")

# ── 2 ──
h2("2. Принцип реализации")
b("Поэтапно: сначала MVP для одного региона, затем итеративное расширение по обратной связи реальных продавцов.")
b("Регионы: Краснодарский край + Калининград. Каждый этап — отдельный согласованный объём.")

# ── 3 ──
h2("3. Роли и доступ (7)")
b("Гость · Покупатель · Продавец / владелец магазина · Сотрудник магазина (под-роли) · Модератор · Арбитр · Администратор платформы.")

# ── 4 ──
h2("4. Функциональные блоки")
b("Каталог и витрина · карточка товара · корзина и оформление заказа.")
b("Статусы заказа: Принят → В обработке → Отправлен → Доставлен → Завершён.")
b("Кабинет покупателя · кабинет продавца · админ-панель.")
b("Оплата (карта / СБП / кошелёк / при получении + эскроу) · доставка (трек, самовывоз) · модерация · споры и арбитраж · чат · уведомления.")

# ── 5 ──
h2("5. Структура карточки товара")
b("Название · ярлыки · изображение · цена / наличие / варианты · кнопки (в корзину, купить, спросить продавца, в избранное).")
b("Краткое и полное описание · характеристики · условия доставки · возврат · блок продавца (рейтинг, «проверенный») · отзывы.")

# ── 6 ──
h2("6. Доверие и расчёты")
b("Эскроу — средства удерживаются платформой до подтверждения доставки.")
b("Модерация — авто-публикация низкорисковых товаров + ручная очередь для подозрительных.")
b("Споры — чат сторон → претензия с доказательствами → арбитр выносит решение (возврат / компенсация / отказ).")

# ── 7 ──
h2("7. Технологический стек")
b("Next.js (App Router) + TypeScript + Tailwind · Prisma + PostgreSQL (на разработке SQLite).")
b("Авторизация · S3 для фото · платежи ЮKassa/Тинькофф · логистика СДЭК / Почта России.")

# ── 8 ──
h2("8. Дорожная карта")
b("MVP → Оплата + эскроу → Споры/арбитраж → Сотрудники + RBAC → Логистика → Маркетинг → Антифрод и аналитика.")

# ── 9 ── статус
h2("9. Статус реализации (демо)")
story.append(Paragraph("Реализовано и работает:", ParagraphStyle("lbl", fontName="Bold", fontSize=10, textColor=SAGE, spaceAfter=3)))
for t in [
    "Витрина-маркетплейс, каталог (категории, фильтры, поиск), карточка, корзина, оформление → заказ в БД.",
    "Кабинет покупателя (заказы со статусами, эскроу, трек, избранное, отзывы, чат).",
    "Кабинет продавца (статистика, добавление товара → модерация, смена статуса заказа, сотрудники).",
    "Админ-панель (дашборд, модерация, споры, пользователи, финансы, аудит-лог).",
    "Вход / выход, избранное, уведомления. Регионы: Краснодар + Калининград.",
    "Светлый премиум-дизайн, анимации, адаптив mobile-first.",
]:
    b(t, st_ok)
story.append(Spacer(1, 5))
story.append(Paragraph("Симуляция — требует ваших внешних аккаунтов/ключей:", ParagraphStyle("lbl2", fontName="Bold", fontSize=10, textColor=AMBER, spaceAfter=3)))
for t in [
    "Онлайн-оплата (ЮKassa/Тинькофф) — методы и статус эскроу показаны, без реальной обработки.",
    "API логистики (СДЭК / Почта) — трек-номера и статусы без реального вызова.",
    "Авторизация с хэшем пароля и подтверждением — сейчас демо-вход.",
    "Антифрод — индикатор без ML-модели.",
]:
    b(t, st_sim)

doc = SimpleDocTemplate(
    os.path.join("docs", "ТЗ-Волга.pdf"),
    pagesize=A4,
    leftMargin=20 * mm, rightMargin=20 * mm, topMargin=18 * mm, bottomMargin=16 * mm,
    title="Волга — ТЗ, ключевые факты", author="Волга",
)
doc.build(story)

out = os.path.join(os.getcwd(), "docs", "ТЗ-Волга.pdf")
print("OK:", out, os.path.getsize(out), "bytes")

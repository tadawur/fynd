#!/bin/bash
# fynd.fans — commit + push sekcie Financovanie
# Spustenie: dvojklik vo Finderi (otvorí Terminál) alebo `bash push-financovanie.command`
cd "$(dirname "$0")"

echo "=== Stav repozitára ==="
git status -sb
echo ""

git add site/index.html
git commit -m "feat(site): pridaná sekcia Financovanie — plán vývoja, prevádzka, break-even"
echo ""

echo "=== Push ==="
git push
echo ""

echo "=== Hotovo — posledné commity ==="
git log --oneline -3
echo ""
read -p "Stlač Enter na zatvorenie..."

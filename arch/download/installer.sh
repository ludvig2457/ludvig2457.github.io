#!/bin/bash

# ЕБУЧИЙ ARCH INSTALLER 9000
# Для настоящих пацанов

# Ща нахуярим такой скрипт, что мамка не горюй!

echo "ЁБ ТВОЮ МАТЬ! Добро пожаловать в пиздатый установщик Arch Linux!"
echo "Ща наебём систему так, что Windows заплачет!"

# Этап 1: ВЫБОР ДИСКА
echo "СУКА, какой диск будем ебашить?"
lsblk
read -p "Введи хуйню типа /dev/sda: " TARGET_DISK

# Этап 2: EFI/GPT ПРОВЕРКА
if ! efibootmgr | grep -q "BootOrder"; then
    echo "EFI не найдено, делаем Legacy BIOS хуйню!"
    parted $TARGET_DISK mklabel msdos
else
    echo "Нахуй EFI режим! Готовим GPT!"
    parted $TARGET_DISK mklabel gpt
    parted $TARGET_DISK mkpart ESP fat32 1MiB 513MiB
    parted $TARGET_DISK set 1 esp on
    mkfs.fat -F32 ${TARGET_DISK}1
fi

# Этап 3: РАЗМЕТКА ДЛЯ БОГОВ
echo "Ща нарежем диск как блять пиццу!"
parted $TARGET_DISK mkpart primary ext4 513MiB 100%

# Этап 4: ФАЙЛОВЫЕ СИСТЕМЫ
echo "Форматируем нахуй!"
mkfs.ext4 ${TARGET_DISK}2
mount ${TARGET_DISK}2 /mnt

if [ -d /sys/firmware/efi ]; then
    mkdir -p /mnt/boot/efi
    mount ${TARGET_DISK}1 /mnt/boot/efi
fi

# Этап 5: WINDOWS ДЕТЕКТ
echo "Есть нахуй Windows на компе? (y/n)"
read HAS_WINDOWS

if [ "$HAS_WINDOWS" = "y" ]; then
    echo "Будем ебашить дуал-бут с Windows!"
    # Тут хуйня для GRUB и Windows
else
    echo "Чистый Arch, ебать да!"
fi

# Этап 6: РАБОЧИЙ СТОЛ
echo "Хочешь рабочий стол? (KDE/GNOME/XFCE/нет)"
read DESKTOP_ENV

case $DESKTOP_ENV in
    KDE) PACKAGES="plasma-meta plasma-nm sddm" ;;
    GNOME) PACKAGES="gnome gnome-extra gdm" ;;
    XFCE) PACKAGES="xfce4 xfce4-goodies lightdm" ;;
    *) echo "Консольный мудак, окей" ;;
esac

# Этап 7: УСТАНОВКА
echo "Начинаем ебашить систему!"
pacstrap /mnt base linux linux-firmware $PACKAGES

# Этап 8: НАСТРОЙКА
echo "Настраиваем хуйню!"
genfstab -U /mnt >> /mnt/etc/fstab

# Этап 9: ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
echo "Создаём пользователя (не хуй собачий!)"
read -p "Имя пользователя: " USERNAME
arch-chroot /mnt useradd -m -G wheel $USERNAME
echo "Задай парень, пароль:"
arch-chroot /mnt passwd $USERNAME

# Этап 10: ГРУБ
echo "Ставим GRUB чтоб всё грузилось!"
arch-chroot /mnt grub-install $TARGET_DISK
arch-chroot /mnt grub-mkconfig -o /boot/grub/grub.cfg

echo "ЁБ ТВОЮ МАТЬ! УСТАНОВКА ЗАВЕРШЕНА!"
echo "Перезагружайся и еби систему как хочешь!"

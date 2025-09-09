import os

inputPath = './file/luchshie-anekdoty-ot-anekdotov-net-2012.txt'
qutputPath = './text/'

with open(inputPath, 'r') as infile:
    current_part = []
    part_number = 0
    
    for line in infile:
        stripped = line.strip()
        if stripped.isdigit():  # Это разделитель (1, 2, 3...)
            if current_part:
                with open(f"{qutputPath}{part_number}.txt", 'w') as f:
                    f.write('\n'.join(current_part))
                current_part = []
            part_number += 1
        elif stripped:  # Не пустая строка
            current_part.append(line.rstrip())
    
    # Сохраняем последнюю часть
    if current_part:
        with open(f"{qutputPath}{part_number}.txt", 'w') as f:
            f.write('\n'.join(current_part))
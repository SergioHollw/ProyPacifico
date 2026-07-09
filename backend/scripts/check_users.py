import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pacificodb.settings')
import django
django.setup()
from apps.usuarios.models import Persona

users = Persona.objects.all()
for u in users:
    pw = u.contrasena
    check = u.check_password("Admin123!")
    print(f'ID={u.id} correo={u.correo} is_active={u.is_active}')
    print(f'  pass len={len(pw)} starts={pw[:20]}')
    print(f'  check password: {check}')

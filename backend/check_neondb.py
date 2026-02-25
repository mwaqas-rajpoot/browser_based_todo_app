from src.database.database import engine
from sqlmodel import text

# Check connection and count tasks
with engine.connect() as conn:
    result = conn.execute(text('SELECT COUNT(*) FROM tasks'))
    count = result.scalar()
    print(f'Tasks in NeonDB: {count}')

    # Show first 5 tasks
    result = conn.execute(text('SELECT id, title, user_id FROM tasks LIMIT 5'))
    tasks = result.fetchall()
    print('\nFirst 5 tasks:')
    for task in tasks:
        print(f'  - {task[1]} (User: {task[2]})')

from datetime import datetime, timedelta
from collections import defaultdict
from app.models import Problem

def get_streak_data(user_id):
    problems=Problem.query.filter_by(user_id=user_id).order_by(Problem.solved_at).all()
    
    if not problems:
        return {"current":0, "longest":0}
    
    solve_dates=sorted({p.solved_at.date() for p in problems})
    today=datetime.utcnow().date()
    
    current=0
    longest=0
    temp=1
    
    for i in range(1,len(solve_dates)):
        if(solve_dates[i]-solve_dates[i-1]).days==1:
            temp+=1
        else:
            longest=max(longest,temp)
            temp=1
    longest=max(longest,temp)
    
    if solve_dates and (today-solve_dates[-1]).days <= 1:
        current = temp
    else:
        current = 0

    return {"current": current, "longest": longest}


def get_heatmap_data(user_id):
    one_year_ago = datetime.utcnow() - timedelta(days=365)
    problems = Problem.query.filter(
        Problem.user_id == user_id,
        Problem.solved_at >= one_year_ago,
    ).all()

    counts = defaultdict(int)
    for p in problems:
        counts[p.solved_at.strftime("%Y-%m-%d")] += 1

    return dict(counts)


def get_difficulty_breakdown(user_id):
    problems = Problem.query.filter_by(user_id=user_id).all()
    data = {"Easy": 0, "Medium": 0, "Hard": 0}
    for p in problems:
        if p.difficulty in data:
            data[p.difficulty] += 1
    return [{"name": k, "value": v} for k, v in data.items()]


def get_topic_breakdown(user_id):
    problems = Problem.query.filter_by(user_id=user_id).all()
    counts = defaultdict(int)
    for p in problems:
        if p.topic:
            counts[p.topic] += 1
    return [{"topic": k, "count": v} for k, v in sorted(counts.items(), key=lambda x: -x[1])]


def get_weekly_progress(user_id):
    eight_weeks_ago = datetime.utcnow() - timedelta(weeks=8)
    problems = Problem.query.filter(
        Problem.user_id == user_id,
        Problem.solved_at >= eight_weeks_ago,
    ).all()

    weeks = defaultdict(int)
    for p in problems:
        weeks[p.solved_at.strftime("W%V")] += 1

    return [{"week": k, "count": v} for k, v in sorted(weeks.items())]
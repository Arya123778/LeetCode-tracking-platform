from flask import Flask
from app.config import Config
from app.extensions import db, migrate, jwt, bcrypt, cors

def create_app(env="default"):
    app=Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    migrate.init_app(app,db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins":"*"}})
    
    from app.routes.auth import auth_bp
    from app.routes.problems import problems_bp
    from app.routes.stats import stats_bp
    from app.routes.goals import goals_bp
    
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(problems_bp, url_prefix="/api/problems")
    app.register_blueprint(stats_bp, url_prefix="/api/stats")
    app.register_blueprint(goals_bp, url_prefix="/api/goals")
    
    return app

    
    
    
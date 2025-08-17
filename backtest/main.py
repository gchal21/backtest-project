import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse

from routes import router


def setup_app():
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    @app.get("/")
    def redirect_to_docs() -> RedirectResponse:
        return RedirectResponse(url="/docs")

    app.include_router(router, prefix="/api")
    return app




def main():
    app = setup_app()
    uvicorn.run(app, host="0.0.0.0", port=8000)



if __name__ == '__main__':
    main()





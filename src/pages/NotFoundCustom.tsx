import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const NotFoundCustom = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="text-center px-4 max-w-2xl">
        <img 
          src="https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/bucket/22283dd2-dc03-4a54-9e7c-4dc7ed04eecd.png"
          alt="Арендодатель"
          className="w-64 mx-auto mb-8 opacity-90"
        />
        <div className="mb-6">
          <h1 className="text-8xl font-bold text-gray-800 mb-2">404</h1>
          <p className="text-2xl text-gray-700 font-semibold mb-2">Страница не найдена</p>
          <p className="text-gray-600">К сожалению, запрашиваемая страница не существует</p>
        </div>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button 
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary/90"
            size="lg"
          >
            <Icon name="Home" className="mr-2" size={20} />
            На главную
          </Button>
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
          >
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundCustom;

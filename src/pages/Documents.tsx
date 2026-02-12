import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useDailyTheme } from '@/hooks/useDailyTheme';

export default function Documents() {
  const theme = useDailyTheme();

  const documentCategories = [
    {
      title: 'Договоры купли-продажи',
      icon: 'FileText',
      description: 'Образцы договоров для сделок с недвижимостью',
      documents: [
        {
          name: 'Договор купли-продажи квартиры',
          description: 'Стандартный образец договора купли-продажи квартиры',
          size: '156 KB',
          format: 'DOC'
        },
        {
          name: 'Договор купли-продажи дома',
          description: 'Образец договора для покупки частного дома',
          size: '142 KB',
          format: 'DOC'
        },
        {
          name: 'Договор купли-продажи земельного участка',
          description: 'Типовой договор для сделок с земельными участками',
          size: '138 KB',
          format: 'DOC'
        }
      ]
    },
    {
      title: 'Договоры аренды',
      icon: 'Home',
      description: 'Образцы договоров аренды недвижимости',
      documents: [
        {
          name: 'Договор аренды квартиры',
          description: 'Стандартная форма договора долгосрочной аренды',
          size: '128 KB',
          format: 'DOC'
        },
        {
          name: 'Договор посуточной аренды',
          description: 'Образец договора для краткосрочной аренды',
          size: '115 KB',
          format: 'DOC'
        },
        {
          name: 'Договор коммерческой аренды',
          description: 'Типовой договор аренды офиса или торгового помещения',
          size: '165 KB',
          format: 'DOC'
        }
      ]
    },
    {
      title: 'Документы для ипотеки',
      icon: 'Calculator',
      description: 'Бланки и образцы для оформления ипотеки',
      documents: [
        {
          name: 'Заявление на ипотечный кредит',
          description: 'Стандартная форма заявки на получение ипотеки',
          size: '95 KB',
          format: 'PDF'
        },
        {
          name: 'Список документов для ипотеки',
          description: 'Полный перечень необходимых документов',
          size: '78 KB',
          format: 'PDF'
        },
        {
          name: 'Справка о доходах по форме банка',
          description: 'Образец заполнения справки о доходах',
          size: '112 KB',
          format: 'DOC'
        }
      ]
    },
    {
      title: 'Юридические документы',
      icon: 'Scale',
      description: 'Необходимые юридические формы и бланки',
      documents: [
        {
          name: 'Доверенность на продажу недвижимости',
          description: 'Образец нотариальной доверенности',
          size: '88 KB',
          format: 'DOC'
        },
        {
          name: 'Акт приема-передачи недвижимости',
          description: 'Стандартная форма акта приема-передачи',
          size: '92 KB',
          format: 'DOC'
        },
        {
          name: 'Согласие супруга на продажу',
          description: 'Образец нотариального согласия супруга',
          size: '75 KB',
          format: 'DOC'
        }
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${theme.gradient}`}>
      <SEO 
        title="Документы и формы | Договоры, бланки, образцы | Арендодатель"
        description="Полезные документы для сделок с недвижимостью: договоры купли-продажи, аренды, образцы заявлений. Скачать бесплатно."
      />
      <Header />
      <main className="container mx-auto px-3 sm:px-4 py-6">
        <Breadcrumbs />
        
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Документы и образцы
          </h1>
          <p className="text-lg text-gray-600">
            Бесплатные образцы договоров, бланков и форм для сделок с недвижимостью
          </p>
        </div>

        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Info" className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Важная информация
                </h3>
                <p className="text-gray-700 mb-3">
                  Представленные образцы документов носят информационный характер. 
                  Перед использованием рекомендуем проконсультироваться с юристом 
                  или нотариусом для адаптации документов под ваши конкретные условия.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => window.location.href = 'tel:+79781281850'}
                    className="gap-2"
                  >
                    <Icon name="Phone" size={18} />
                    Консультация юриста
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/services'}
                    className="gap-2"
                  >
                    <Icon name="Briefcase" size={18} />
                    Наши услуги
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {documentCategories.map((category, categoryIndex) => (
          <section key={categoryIndex} className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Icon name={category.icon} className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.documents.map((doc, docIndex) => (
                <Card key={docIndex} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="FileDown" className="text-primary" size={24} />
                      </div>
                      <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">
                        {doc.format}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{doc.name}</CardTitle>
                    <CardDescription>{doc.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{doc.size}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => {
                          window.location.href = 'tel:+79781281850';
                        }}
                      >
                        <Icon name="Download" size={16} />
                        Получить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}

        <Card className="bg-gradient-to-br from-primary to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Нужна помощь с документами?</CardTitle>
            <CardDescription className="text-white/90 text-base">
              Наши специалисты помогут правильно оформить все документы для вашей сделки
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:+79781281850"
                className="flex items-center justify-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                <Icon name="Phone" size={20} />
                Позвонить: +7 978 128-18-50
              </a>
              <a
                href="https://t.me/+79781281850"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                <Icon name="Send" size={20} />
                Написать в Telegram
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import { programs, documentsData } from '@/data/mortgageData';
import { useDailyBlogPost } from '@/hooks/useDailyBlogPost';
import { useArticlePublisher } from '@/hooks/useArticlePublisher';
import FullscreenArticle from '@/components/FullscreenArticle';

export default function DocumentsAndBlogTabs() {
  const blogArticles = useDailyBlogPost();
  useArticlePublisher(blogArticles);
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [fullscreenArticle, setFullscreenArticle] = useState<number | null>(null);
  const [blogCategory, setBlogCategory] = useState('all');
  const [selectedDocProgram, setSelectedDocProgram] = useState('family');

  const generatePDF = () => {
    const doc = new jsPDF();
    const selectedDoc = documentsData.find(d => d.program === selectedDocProgram);
    const selectedProgram = programs.find(p => p.id === selectedDocProgram);
    
    if (!selectedDoc || !selectedProgram) return;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Чек-лист документов для ипотеки', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(selectedDoc.name, 105, 35, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Ставка: ${selectedProgram.rate} | Сумма: ${selectedProgram.maxAmount} | Срок: ${selectedProgram.term}`, 105, 45, { align: 'center' });
    
    let yPos = 60;
    
    selectedDoc.requirements.forEach((req) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(req.category, 20, yPos);
      yPos += 8;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      req.items.forEach((item) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        const lines = doc.splitTextToSize(`• ${item}`, 170);
        doc.text(lines, 25, yPos);
        yPos += lines.length * 6;
      });
      
      yPos += 5;
    });
    
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    yPos += 10;
    doc.setFillColor(240, 248, 255);
    doc.rect(15, yPos - 5, 180, 35, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Важная информация:', 20, yPos);
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('• Все документы должны быть в оригинале или нотариально заверены', 20, yPos);
    yPos += 6;
    doc.text('• Справки и выписки действительны 30 дней с момента выдачи', 20, yPos);
    yPos += 6;
    doc.text('• Дополнительные документы могут потребоваться банком', 20, yPos);
    yPos += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Контакты для консультации:', 20, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.text('Телефон: +7 978 128-18-50', 20, yPos);
    yPos += 5;
    doc.text('Email: ipoteka_krym@mail.ru', 20, yPos);
    
    doc.save(`Чек-лист_${selectedDoc.name.replace(/ /g, '_')}.pdf`);
    
    toast({
      title: 'PDF скачан!',
      description: 'Чек-лист документов сохранен на ваше устройство',
      className: 'bg-green-50 border-green-200'
    });
  };

  return (
    <>
      <TabsContent value="documents" className="space-y-4 sm:space-y-6">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Документы и требования</h2>
          <p className="text-sm sm:text-base text-gray-600">Полный список необходимых документов для каждой программы</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          {documentsData.map((doc) => (
            <Card
              key={doc.program}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedDocProgram === doc.program ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedDocProgram(doc.program)}
            >
              <CardContent className="p-3 sm:p-6 text-center">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 ${doc.color} rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3`}>
                  <Icon name={doc.icon} className="text-white" size={24} />
                </div>
                <p className="font-semibold text-xs sm:text-sm">{doc.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {documentsData
          .filter((doc) => doc.program === selectedDocProgram)
          .map((doc) => (
            <div key={doc.program} className="space-y-6">
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 ${doc.color} rounded-lg flex items-center justify-center`}>
                      <Icon name={doc.icon} className="text-white" size={32} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{doc.name}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        {programs.find(p => p.id === doc.program)?.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 bg-white/80 p-4 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Ставка</p>
                      <p className="text-2xl font-bold text-primary">
                        {programs.find(p => p.id === doc.program)?.rate}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Максимальная сумма</p>
                      <p className="text-2xl font-bold">
                        {programs.find(p => p.id === doc.program)?.maxAmount}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Срок</p>
                      <p className="text-2xl font-bold">
                        {programs.find(p => p.id === doc.program)?.term}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {doc.requirements.map((req, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Icon name="CheckCircle2" className="text-primary" size={24} />
                      {req.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {req.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon name="Check" className="text-primary" size={14} />
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Info" className="text-green-600" size={24} />
                      Важная информация
                    </CardTitle>
                    <Button onClick={generatePDF} size="sm" variant="outline">
                      <Icon name="Download" className="mr-2" size={16} />
                      Скачать PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-700">
                    <strong>Все документы</strong> должны быть предоставлены в оригинале или нотариально заверенных копиях.
                  </p>
                  <p className="text-gray-700">
                    <strong>Сроки действия:</strong> Справки и выписки действительны 30 дней с момента выдачи.
                  </p>
                  <p className="text-gray-700">
                    <strong>Дополнительные документы</strong> могут потребоваться в зависимости от требований банка.
                  </p>
                  <div className="border-t border-green-200 pt-4 mt-4">
                    <p className="font-semibold mb-3 flex items-center gap-2">
                      <Icon name="Phone" className="text-primary" size={18} />
                      Нужна помощь с документами?
                    </p>
                    <p className="text-gray-700 mb-4">
                      Мы поможем подготовить все необходимые документы и проверим их корректность
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild size="sm">
                        <a href="tel:+79781281850">
                          <Icon name="Phone" className="mr-2" size={16} />
                          Позвонить
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="mailto:ipoteka_krym@mail.ru">
                          <Icon name="Mail" className="mr-2" size={16} />
                          Написать
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://agencies.domclick.ru/agent/5621837?utm_source=partnerhub&utm_content=profile" target="_blank" rel="noopener noreferrer">
                          <Icon name="ExternalLink" className="mr-2" size={16} />
                          Домклик
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
      </TabsContent>

      <TabsContent value="blog" className="space-y-4 sm:space-y-6">
        <div className="mb-4 sm:mb-6">
          <div className="mb-3 sm:mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Блог об ипотеке</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Полезные статьи и советы от экспертов</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={blogCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setBlogCategory('all')}
            >
              Все
            </Button>
            <Button
              variant={blogCategory === 'Советы' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setBlogCategory('Советы')}
            >
              Советы
            </Button>
            <Button
              variant={blogCategory === 'Финансы' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setBlogCategory('Финансы')}
            >
              Финансы
            </Button>
            <Button
              variant={blogCategory === 'Программы' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setBlogCategory('Программы')}
            >
              Программы
            </Button>
            <Button
              variant={blogCategory === 'Регион' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setBlogCategory('Регион')}
            >
              Регион
            </Button>
          </div>
        </div>

        {blogArticles.length === 0 ? (
          <Card className="p-8 text-center">
            <Icon name="BookOpen" size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold mb-2">Статьи скоро появятся</h3>
            <p className="text-gray-600">Мы готовим для вас полезные материалы об ипотеке</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {blogArticles
              .filter(article => blogCategory === 'all' || article.category === blogCategory)
              .map((article) => (
            <Card 
              key={article.id} 
              className="hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
              onClick={() => setFullscreenArticle(article.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary">{article.category}</Badge>
                </div>
                <div className={`absolute top-3 right-3 w-12 h-12 ${article.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon name={article.icon} className="text-white" size={24} />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{article.title}</CardTitle>
                <CardDescription className="text-base mt-2">{article.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-2">
                    <Icon name="Calendar" size={14} />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Clock" size={14} />
                    <span>{article.readTime}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullscreenArticle(article.id);
                    }}
                  >
                    <Icon name="Maximize2" className="mr-2" size={16} />
                    Открыть
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedArticle(article.id);
                        }}
                      >
                        <Icon name="Eye" size={18} />
                      </Button>
                    </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <div className="relative h-64 -mx-6 -mt-6 mb-6 overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                          <Badge variant="secondary" className="bg-white/90">{article.category}</Badge>
                        </div>
                      </div>
                      <DialogTitle className="text-2xl mb-4">{article.title}</DialogTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Icon name="Calendar" size={14} />
                          <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Clock" size={14} />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                    </DialogHeader>
                    <div
                      className="prose prose-lg max-w-none mt-6"
                      dangerouslySetInnerHTML={{ __html: article.content }}
                      style={{
                        color: '#374151',
                        lineHeight: '1.75'
                      }}
                    />
                    <div className="border-t pt-6 mt-6 space-y-6">
                      <ArticleComments articleId={article.id} />
                      
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <Icon name="Phone" className="text-primary" size={20} />
                          Нужна консультация?
                        </h4>
                        <p className="text-gray-700 mb-4">Свяжитесь с нашим экспертом для получения персональной консультации</p>
                        <div className="flex flex-wrap gap-2">
                          <Button asChild size="sm">
                            <a href="tel:+79781281850">
                              <Icon name="Phone" className="mr-2" size={16} />
                              Позвонить
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href="mailto:ipoteka_krym@mail.ru">
                              <Icon name="Mail" className="mr-2" size={16} />
                              Написать
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href="https://agencies.domclick.ru/agent/5621837?utm_source=partnerhub&utm_content=profile" target="_blank" rel="noopener noreferrer">
                              <Icon name="ExternalLink" className="mr-2" size={16} />
                              Домклик
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {fullscreenArticle && (
          <FullscreenArticle
            article={blogArticles.find(a => a.id === fullscreenArticle)!}
            onClose={() => setFullscreenArticle(null)}
          />
        )}
      </TabsContent>
    </>
  );
}
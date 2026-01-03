import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { QuizResult, getTimeAgo } from './crm-types';

interface CRMQuizStatsProps {
  quizResults: QuizResult[];
}

export default function CRMQuizStats({ quizResults }: CRMQuizStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Статистика опросов</CardTitle>
        <CardDescription>Результаты прохождения опроса по подбору ипотеки</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quizResults.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Данных по опросам пока нет</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizResults.map((result, idx) => (
                <Card key={idx} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">{result.recommended_program}</span>
                        <Badge className="bg-blue-500">{result.count} прохождений</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Категория:</span>
                          <div>{result.category}</div>
                        </div>
                        <div>
                          <span className="font-medium">Регион:</span>
                          <div>{result.region}</div>
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium">Сумма кредита:</span>
                          <div>{result.loan_amount_range}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                        <Icon name="Clock" size={12} />
                        <span>Последнее:</span>
                        <span className="font-medium">{getTimeAgo(result.last_taken)}</span>
                        <span className="text-gray-400">({new Date(result.last_taken).toLocaleString('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })})</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { programs } from '@/data/mortgageData';

export default function ProgramsAndComparisonTabs() {
  return (
    <>
      <TabsContent value="programs" className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {programs.map((program) => (
            <Card key={program.id} className="hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{program.name}</CardTitle>
                    <CardDescription className="text-base mt-2">{program.description}</CardDescription>
                  </div>
                  <div className={`w-14 h-14 ${program.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon name={program.icon} className="text-white" size={28} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Ставка</p>
                    <p className="text-2xl font-bold text-primary">{program.rate}</p>
                    {program.rateSpecial && (
                      <p className="text-xs text-green-600 mt-1">{program.rateSpecial}</p>
                    )}
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Макс. сумма</p>
                    <p className="text-2xl font-bold text-secondary">{program.maxAmount}</p>
                    {program.maxAmountRegions && (
                      <p className="text-xs text-gray-600 mt-1">{program.maxAmountRegions}</p>
                    )}
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Первый взнос</p>
                    <p className="text-xl font-bold">{program.downPayment}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Срок</p>
                    <p className="text-xl font-bold">{program.term}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="font-semibold text-gray-800">Условия участия:</p>
                  <ul className="space-y-1">
                    {program.eligibility.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <Icon name="CheckCircle2" className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <p className="text-sm text-gray-600 border-t pt-4">{program.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="comparison" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Сравнение программ</CardTitle>
            <CardDescription>Основные параметры всех доступных программ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Программа</th>
                    <th className="text-center p-4 font-semibold">Ставка</th>
                    <th className="text-center p-4 font-semibold">Макс. сумма</th>
                    <th className="text-center p-4 font-semibold">Первый взнос</th>
                    <th className="text-center p-4 font-semibold">Срок</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((program) => (
                    <tr key={program.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${program.color} rounded-lg flex items-center justify-center`}>
                            <Icon name={program.icon} className="text-white" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold">{program.name}</p>
                            <p className="text-sm text-gray-600">{program.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant="secondary" className="text-base">{program.rate}</Badge>
                      </td>
                      <td className="p-4 text-center font-semibold">{program.maxAmount}</td>
                      <td className="p-4 text-center font-semibold">{program.downPayment}</td>
                      <td className="p-4 text-center font-semibold">{program.term}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}

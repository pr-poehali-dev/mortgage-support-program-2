import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import TagCloud from '@/components/TagCloud';

export default function TagsTab() {
  return (
    <TabsContent value="tags" className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Теги</CardTitle>
          <CardDescription>
            Все популярные запросы по недвижимости, ипотеке, банкам и государственным услугам в Севастополе
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TagCloud />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

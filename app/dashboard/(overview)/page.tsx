import CardWrapper, { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import {fetchLatestInvoices, fetchRevenue, fetchCardData, fetchUsers} from "@/app/lib/data";
import {Suspense} from "react";
import {LatestInvoicesSkeleton, RevenueChartSkeleton} from "@/app/ui/skeletons";
import {Metadata} from "next";

export const metadata:Metadata={
    title:"Home"
}

export default async function Page() {
    return (
         <main>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {<Suspense><CardWrapper/></Suspense>}
              </div>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                   { <Suspense fallback={<RevenueChartSkeleton/>}>
                       <RevenueChart />
                   </Suspense> }
                   { <Suspense fallback={<LatestInvoicesSkeleton/>}><LatestInvoices/></Suspense> }
              </div>
         </main>
     );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const weeklyTaskData = [
  { day: "Mon", completed: 12, pending: 4 },
  { day: "Tue", completed: 18, pending: 6 },
  { day: "Wed", completed: 15, pending: 3 },
  { day: "Thu", completed: 22, pending: 5 },
  { day: "Fri", completed: 20, pending: 8 },
  { day: "Sat", completed: 8, pending: 2 },
  { day: "Sun", completed: 5, pending: 1 },
];

const taskDistributionData = [
  { name: "Maintenance", value: 35, color: "hsl(217, 91%, 60%)" },
  { name: "Cleaning", value: 28, color: "hsl(142, 76%, 36%)" },
  { name: "Inspection", value: 20, color: "hsl(38, 92%, 50%)" },
  { name: "Repairs", value: 17, color: "hsl(262, 83%, 58%)" },
];

export function TaskCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
      
      {/* Weekly Tasks Bar Chart */}
      <Card className="shadow-soft border-0 sm:border">
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
          <CardTitle className="text-base sm:text-lg md:text-xl font-semibold">
            Weekly Task Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-4 pb-4 sm:pb-6">
          {/* Chart Container - Responsive Height */}
          <div className="h-[200px] sm:h-[220px] md:h-[250px] lg:h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={weeklyTaskData}
                margin={{ 
                  left: 5, 
                  right: 5, 
                  top: 10, 
                  bottom: 5 
                }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="day"
                  tick={{ 
                    fill: "hsl(var(--muted-foreground))", 
                    fontSize: 10,
                    fontWeight: 400
                  }}
                  axisLine={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                  tickLine={false}
                  interval={0}
                  height={30}
                />
                <YAxis
                  tick={{ 
                    fill: "hsl(var(--muted-foreground))", 
                    fontSize: 10,
                    fontWeight: 400
                  }}
                  axisLine={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                  tickLine={false}
                  width={30}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "11px",
                    padding: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                  }}
                  labelStyle={{
                    fontWeight: 600,
                    marginBottom: "4px"
                  }}
                />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                  barSize={window.innerWidth < 640 ? 12 : 16}
                />
                <Bar
                  dataKey="pending"
                  name="Pending"
                  fill="hsl(var(--chart-3))"
                  radius={[4, 4, 0, 0]}
                  barSize={window.innerWidth < 640 ? 12 : 16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Mobile Legend - Only visible on small screens */}
          <div className="flex items-center justify-center gap-4 mt-3 sm:hidden">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--chart-2))]" />
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--chart-3))]" />
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Distribution Pie Chart */}
      <Card className="shadow-soft border-0 sm:border">
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
          <CardTitle className="text-base sm:text-lg md:text-xl font-semibold">
            Task Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-4 pb-4 sm:pb-6">
          {/* Chart Container - Responsive Height */}
          <div className="h-[200px] sm:h-[220px] md:h-[250px] lg:h-[280px] w-full">
            <div className="flex flex-col sm:flex-row items-center h-full">
              
              {/* Pie Chart Section */}
              <div className="w-full sm:w-[60%] h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Pie
                      data={taskDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={window.innerWidth < 640 ? 35 : 45}
                      outerRadius={window.innerWidth < 640 ? 60 : 75}
                      paddingAngle={2}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) => 
                        window.innerWidth < 640 
                          ? `${(percent * 100).toFixed(0)}%` 
                          : `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {taskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "11px",
                        padding: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                      }}
                      formatter={(value: number) => [`${value}%`, 'Percentage']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend Section - Responsive Layout */}
              <div className="w-full sm:w-[40%] mt-3 sm:mt-0 sm:pl-2">
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
                  {taskDistributionData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 sm:gap-3">
                      <div
                        className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-muted-foreground truncate">
                          {item.name}
                        </span>
                        <span className="text-xs sm:text-sm font-medium ml-1 sm:ml-auto">
                          {item.value}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Summary - Only visible on small screens */}
          <div className="mt-3 pt-2 border-t sm:hidden">
            <p className="text-xs text-center text-muted-foreground">
              Total tasks: 100% • {taskDistributionData.length} categories
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
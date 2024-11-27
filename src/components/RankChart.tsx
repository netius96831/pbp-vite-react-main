import { VictoryLine, VictoryChart, VictoryScatter, VictoryTooltip } from 'victory';
import { BookRankData } from '../types/book-rank-item';
import { toDatetimeString } from '../utils/to-date-string';

export function RankChart({rankData}: {rankData: BookRankData[]}) {
  const maxRank = Math.max(...rankData.map((data) => data.salesRank))
  const minRank = Math.min(...rankData.map((data) => data.salesRank))

  const minDatetime = Math.min(...rankData.map((data) => new Date(data.datetimeCollected).getTime()))
  const maxDatetime = Math.max(...rankData.map((data) => new Date(data.datetimeCollected).getTime()))
  const oneDay = 24*60*60*1000
  const atLeastOneDay = maxDatetime > minDatetime + oneDay

  const sortedRankData = rankData.sort((a, b) => a.datetimeCollected > b.datetimeCollected ? 1 : -1).map((data) => {
    return {
      ...data,
      datetimeCollected: new Date(data.datetimeCollected)
    }
  })

  return (
    <VictoryChart
      domain={{
        y: [maxRank * 1.1, minRank * 0.9],
        x: [atLeastOneDay ? minDatetime : minDatetime - (oneDay/2), atLeastOneDay ? maxDatetime : maxDatetime + (oneDay/2)]
      }}
      padding={{ top: 0, bottom: 30, left: 70, right: 20 }}
      scale={{ x: "time", y: "linear" }}
      height={230}
    >
      <VictoryLine
        data={sortedRankData}
        x="datetimeCollected"
        y="salesRank"
      />
      <VictoryScatter
        labels={({datum}: {datum: BookRankData}) => `
          Rank: ${datum.salesRank}\n
          ${toDatetimeString(new Date(datum.datetimeCollected)).split(',').join('\n')}`
        }
        labelComponent={<VictoryTooltip />}
        data={sortedRankData}
        x="datetimeCollected"
        y="salesRank"
      />
    </VictoryChart>
  )
}
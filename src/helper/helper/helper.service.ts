import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  mb2bytes(mb: number): number {
    return mb * 1024 * 1024;
  }

  fillAndSortData(data) {
    // Convert data to dictionary format
    const dataDict: { [key: string]: number } = {};
    data.forEach((d) => {
      dataDict[d.hour] = d.duration;
    });

    // Create a new dictionary to store the sorted data and filled elements
    const filledDict: { [key: string]: number } = {};

    // Iterate through numbers 0 to 24
    for (let i = 0; i < 25; i++) {
      const key = i.toString().padStart(2, '0'); // Convert the number to two-digit format
      if (key in dataDict) {
        filledDict[key] = dataDict[key];
      } else {
        filledDict[key] = 0;
      }
    }

    // Convert the new dictionary back to a list of objects
    const filledData = Object.keys(filledDict).map((key) => ({
      hour: key,
      duration: filledDict[key],
    }));

    // Sort the filled data by hour
    filledData.sort((a, b) => a.hour.localeCompare(b.hour));

    return filledData;
  }

  fillMissingDates(data, fromDate, toDate) {
    const newData = [...data];
    const currentDate = new Date(fromDate);
    const lastDate = new Date(toDate);

    while (currentDate <= lastDate) {
      const currentDateStr = currentDate.toISOString().split('T')[0];
      const existingData = data.find((item) => item.date === currentDateStr);

      if (!existingData) {
        newData.push({
          'Total Meetings': 0,
          'Total Duration': 0,
          'Total Users Join': 0,
          date: currentDateStr,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    newData.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const finalData = [];
    newData.forEach((item) => {
      finalData.push(
        ...[
          {
            date: item.date,
            type: 'Total Meetings',
            value: item['Total Meetings'],
          },
          {
            date: item.date,
            type: 'Total Duration',
            value: item['Total Duration'],
          },
          {
            date: item.date,
            type: 'Total Users Join',
            value: item['Total Users Join'],
          },
        ],
      );
    });
    return finalData;
  }
}

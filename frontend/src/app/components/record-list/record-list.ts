import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RecordService } from '../../services/record';
import { summarizeRecordBatch, RecordSummary } from '../../utils/record-analytics';
import { formatRecordsAsCsv } from '../../utils/export-format';

@Component({
  selector: 'app-record-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './record-list.html',
})
export class RecordListComponent implements OnInit {
  constructor(public recordService: RecordService) {}

  ngOnInit() {
    this.recordService.refresh();
  }

  summarize(strict: boolean): RecordSummary {
    return summarizeRecordBatch(this.recordService.records(), { strict });
  }

  exportAsCsv(): string {
    return formatRecordsAsCsv(this.recordService.records());
  }
}

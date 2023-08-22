import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType, ChartData, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from 'src/app/services/websocket.service';
@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {

  constructor(private http: HttpClient, public wsService: WebsocketService){}

  ngOnInit(): void {
    this.getData();
    this.escucharSocket();
    console.error(this.escucharSocket());
    console.log(this.escucharSocket());
  }
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  public barChartData: ChartData<'bar'> = {
    labels: ['Pregunta 1', 'Pregunta 2', 'Pregunta 3', 'Pregunta 4'],
    datasets: [
      { data: [65, 59, 80, 81], label: 'Entrevistados' },
    ],
  };

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40,
    ];

    this.chart?.update();
  }

  getData(){
    this.http.get('http://localhost:5000/grafica').subscribe((data: any) => {
      this.barChartData.datasets[0].label = data[0].label;
      this.barChartData.datasets[0].data = data[0].data;
      this.chart?.update();
    });
  }

  escucharSocket(){
    this.wsService.listen('cambio-grafica').subscribe((data: any) => {
      this.barChartData.datasets[0].label = data[0].label;
      this.barChartData.datasets[0].data = data[0].data;
      this.chart?.update();
    });
  }
}

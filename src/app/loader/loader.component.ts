import { Component, OnInit, TemplateRef } from '@angular/core';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { LoaderService } from '../servicios/loader.service';




const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#1976d2';


@Component({
  selector: 'vex-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  public loading = true;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public coloursEnabled = false;
  public loadingTemplate!: TemplateRef<any>;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;


  constructor(
    public loaderService: LoaderService
  ) { }

  ngOnInit(): void {

  }



}

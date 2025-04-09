import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  interval,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { ModelService } from '../services/mode.service';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { RiotService } from '../services/riot.service';
import { IModelData } from '../models/model-data.type';
import { FileManagementService } from '../services/file-management.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

interface IChampion {
  name: string;
  position: 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'UTILITY';
  championId: number;
}

interface IChampionItem {
  championName: string;
}

interface IObjectives {
  gold: number;
  championKills: number;
  towerKills: number;
  grubKills: number;
  heraldKills: number;
  dragonKills: number;
  baronKills: number;
  atakhan: boolean;
}

@Component({
  selector: 'app-tracker',
  imports: [CommonModule, MatDividerModule, MatButtonModule, RouterModule],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.scss',
  providers: [ModelService, RiotService, FileManagementService],
})
export class TrackerComponent implements OnInit, OnDestroy {
  private readonly modelService = inject(ModelService);
  private readonly riotService = inject(RiotService);
  private readonly fileManagement = inject(FileManagementService);

  allPlayers = signal<any>(null);

  champions = signal<any>(null);
  items = signal<any>(null);

  blueChampions = signal<IChampion[]>([]);
  redChampions = signal<IChampion[]>([]);

  redObjectives = signal<IObjectives | null>(null);
  blueObjectives = signal<IObjectives | null>(null);

  championItems = signal<IChampionItem[]>([]);

  protected componentDestroyed$ = new Subject<boolean>();
  ngOnInit(): void {
    this.fileManagement
      .getJsonFile('./champions.json')
      .then((champions) => this.champions.set(champions));
    this.fileManagement
      .getJsonFile('./items.json')
      .then((items) => this.items.set(items));

    interval(30000)
      .pipe(
        takeUntil(this.componentDestroyed$),
        switchMap(() => this.riotService.getLiveData()),
        map((riotData) => this.mapRiotData(riotData)),
        switchMap((x) => this.modelService.getPrediction(x))
      )
      .subscribe({
        next: (results) => this.handleResults(results),
        error: (err) => this.handleError(err),
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  private mapRiotData(data: any): IModelData {
    const champions = this.champions();
    const items = this.items();
    let blueChampions = this.blueChampions();
    let redChampions = this.redChampions();

    const players = data.allPlayers;

    if (blueChampions.length === 0 || redChampions.length === 0) {
      const championData = this.getChampions(players);

      blueChampions = championData.blueChampions;
      redChampions = championData.redChampions;
    }

    console.log(blueChampions);
    console.log(redChampions);

    const blueChampionName = blueChampions.map((x) => x.name);
    const redChampionName = redChampions.map((x) => x.name);

    let blueGold = 0;
    let redGold = 0;

    let blueChampionKills = 0;
    let redChampionKills = 0;

    let blueTowerKills = 0;
    let redTowerKills = 0;

    let blueHeraldKills = 0;
    let redHeraldKills = 0;

    let blueGrubKills = 0;
    let redGrubKills = 0;

    let blueDragonKills = 0;
    let redDragonKills = 0;

    let blueBaronKills = 0;
    let redBaronKills = 0;

    let blueAtakhanKills = 0;
    let redAtakhanKills = 0;

    for (const player of players) {
      let total_gold = 0;
      let name = player.isBot
        ? player.riotIdGameName + ' Bot'
        : player.riotIdGameName;

      for (const item of player.items) {
        if (item.slot == 6) {
          continue;
        }

        total_gold += items.data[item.itemID].gold.total;
      }

      if (blueChampionName.includes(name)) {
        blueGold += total_gold;
      } else {
        redGold += total_gold;
      }
    }

    for (const event of data.events.Events) {
      switch (event.EventName) {
        case 'HordeKill':
          if (blueChampionName.includes(event.KillerName)) {
            blueGrubKills += 1;
          } else {
            redGrubKills += 1;
          }
          break;
        case 'DragonKill':
          if (blueChampionName.includes(event.KillerName)) {
            blueDragonKills += 1;
          } else {
            redDragonKills += 1;
          }
          break;
        case 'AtakhanKill':
          if (blueChampionName.includes(event.KillerName)) {
            blueAtakhanKills += 1;
          } else {
            redAtakhanKills += 1;
          }
          break;
        case 'BaronKill':
          if (blueChampionName.includes(event.KillerName)) {
            blueBaronKills += 1;
          } else {
            redBaronKills += 1;
          }
          break;
        case 'ChampionKill':
          if (blueChampionName.includes(event.KillerName)) {
            blueChampionKills += 1;
          } else if (redChampionName.includes(event.KillerName)) {
            redChampionKills += 1;
          }
          break;
        case 'HeraldKill':
          if (blueChampionName.includes(event.KillerName)) {
            blueHeraldKills += 1;
          } else if (redChampionName.includes(event.KillerName)) {
            redHeraldKills += 1;
          }
          break;
        case 'TurretKilled':
          if (blueChampionName.includes(event.KillerName)) {
            blueTowerKills += 1;
          } else {
            redTowerKills += 1;
          }
          break;
      }
    }

    this.blueObjectives.set({
      gold: blueGold,
      championKills: blueChampionKills,
      towerKills: blueTowerKills,
      grubKills: blueGrubKills,
      heraldKills: blueHeraldKills,
      dragonKills: blueDragonKills,
      baronKills: blueBaronKills,
      atakhan: blueAtakhanKills === 1,
    });

    this.redObjectives.set({
      gold: redGold,
      championKills: redChampionKills,
      towerKills: redTowerKills,
      grubKills: redGrubKills,
      heraldKills: redHeraldKills,
      dragonKills: redDragonKills,
      baronKills: redBaronKills,
      atakhan: redAtakhanKills === 1,
    });

    return {
      duration: data.gameData.gameTime,
      blueTop: blueChampions.find((x) => x.position === 'TOP')?.championId,
      blueJG: blueChampions.find((x) => x.position === 'JUNGLE')?.championId,
      blueMid: blueChampions.find((x) => x.position === 'MIDDLE')?.championId,
      blueBot: blueChampions.find((x) => x.position === 'BOTTOM')?.championId,
      blueSupp: blueChampions.find((x) => x.position === 'UTILITY')?.championId,

      redTop: redChampions.find((x) => x.position === 'TOP')?.championId,
      redJG: redChampions.find((x) => x.position === 'JUNGLE')?.championId,
      redMid: redChampions.find((x) => x.position === 'MIDDLE')?.championId,
      redBot: redChampions.find((x) => x.position === 'BOTTOM')?.championId,
      redSupp: redChampions.find((x) => x.position === 'UTILITY')?.championId,

      goldDifference: blueGold - redGold,

      blueChampKills: blueChampionKills,
      blueTowerKills: blueTowerKills,
      blueGrubs: blueGrubKills,
      blueHeralds: blueHeraldKills,
      blueDragons: blueDragonKills,
      blueBaron: blueBaronKills,
      blueAtakhan: blueAtakhanKills,

      redChampKills: redChampionKills,
      redTowerKills: redTowerKills,
      redGrubs: redGrubKills,
      redHeralds: redHeraldKills,
      redDragons: redDragonKills,
      redBaron: redBaronKills,
      redAtakhan: redAtakhanKills,
    } as IModelData;
  }

  private getChampions(players: any[]): {
    blueChampions: IChampion[];
    redChampions: IChampion[];
  } {
    const blueChampions: IChampion[] = [];
    const redChampions: IChampion[] = [];

    for (const player of players) {
      if (player.team === 'ORDER') {
        blueChampions.push({
          name: player.isBot
            ? player.riotIdGameName + ' Bot'
            : player.riotIdGameName,
          position: player.position,
          championId: this.getChampion(player.championName),
        });
      } else {
        redChampions.push({
          name: player.isBot
            ? player.riotIdGameName + ' Bot'
            : player.riotIdGameName,
          position: player.position,
          championId: this.getChampion(player.championName),
        });
      }
    }

    this.blueChampions.set(blueChampions);
    this.redChampions.set(redChampions);

    return {
      blueChampions,
      redChampions,
    };
  }

  private getChampion(championName: string): number {
    const champions = this.champions();
    let championId = -1;

    console.log(champions);

    Object.values(champions.data).forEach((champion: any) => {
      if (championId !== -1) {
        return;
      }

      if (champion.name === championName) {
        championId = champion.key;
      }
    });

    if (championId === -1) {
      console.error(`Could not find championId with name ${championName}`);
    }
    return championId;
  }

  private handleResults(results: any) {
    console.log(results);
  }

  private handleError(err: any): Observable<void> {
    // TODO: Save to files
    console.log(err);

    return of();
  }
}

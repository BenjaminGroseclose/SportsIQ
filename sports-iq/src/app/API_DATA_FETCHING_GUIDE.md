# API Data Fetching Guide

This guide explains how to fetch data from your API when a user is logged in using the SportsIQ architecture.

## Overview

The system automatically fetches user account data when authentication occurs. Here's how it works:

```
User logs in (Auth0)
    ↓
isAuthenticated$ emits true
    ↓
UserStateService automatically calls loadAccountData()
    ↓
AccountService.getUser() fetches data from API
    ↓
Account data stored in state with loading/error flags
    ↓
Components automatically re-render with new data
```

## How It Works

### 1. **UserStateService** - Automatic Data Loading

The `UserStateService` automatically handles authentication state and data fetching:

```typescript
// src/app/state/user-state.service.ts

export class UserStateService extends StateBase<UserState> {
  // State includes:
  // - user: Auth0 user object
  // - account: Your application account data (fetched from API)
  // - isAuthenticated: Login status
  // - loading: Data fetch in progress
  // - loaded: Data has been fetched at least once
  // - error: Error message if fetch fails
}
```

**What happens:**

- When `isAuthenticated` changes to `true`, it automatically calls `loadAccountData()`
- `loadAccountData()` calls `AccountService.getUser()` with the user's email
- Account data is stored in state with loading status
- When `isAuthenticated` becomes `false` (logout), account data is cleared

### 2. **AccountService** - API Communication

The service extends `HttpBase` which handles HTTP requests:

```typescript
export class AccountService extends HttpBase {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'account'); // Base URL: {baseUrl}/api/account
  }

  getUser(username: string): Observable<IAccount> {
    // Makes request to: {baseUrl}/api/account/{username}
    return this.get<IAccount>(username);
  }
}
```

## Usage Examples

### Example 1: Display User Profile (Automatic)

```typescript
// home.ts
import { Component, inject } from '@angular/core';
import { UserStateService } from '../../state/user-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  template: `
    @if (isLoading()) {
      <p>Loading profile...</p>
    } @else if (hasError()) {
      <p class="error">{{ hasError() }}</p>
    } @else if (isAuthenticated()) {
      <h1>Welcome, {{ displayName() }}!</h1>
      <p>Email: {{ email() }}</p>
      <img [src]="user().account?.profilePictureUrl" alt="Profile" />
    } @else {
      <p>Please log in</p>
    }
  `,
})
export class Home {
  private userState = inject(UserStateService);

  // Access state signals - they'll update when data is fetched
  user = this.userState.state;
  displayName = this.userState.displayName;
  email = this.userState.email;
  isAuthenticated = () => this.userState.state().isAuthenticated;
  isLoading = () => this.userState.state().loading;
  hasError = () => this.userState.state().error;
}
```

### Example 2: Create a Data Service

You can create specialized services for fetching different types of data:

```typescript
// src/app/services/games.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpBase } from '@sports-iq/libs/services';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Game {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: Date;
  score?: string;
}

@Injectable({ providedIn: 'root' })
export class GamesService extends HttpBase {
  constructor(http: HttpClient) {
    super(http, 'games'); // Base URL: {baseUrl}/api/games
  }

  getUpcomingGames(): Observable<Game[]> {
    return this.get<Game[]>('upcoming');
  }

  getGameById(id: number): Observable<Game> {
    return this.get<Game>(id.toString());
  }

  saveGame(game: Game): Observable<Game> {
    return this.post<Game>(null, game);
  }

  updateGame(id: number, game: Partial<Game>): Observable<Game> {
    return this.put<Game>(id.toString(), game);
  }

  deleteGame(id: number): Observable<void> {
    return this.delete<void>(id.toString());
  }
}
```

### Example 3: State Service for Domain Data

Create a state service for managing specific domain data (like games):

```typescript
// src/app/state/games-state.service.ts
import { Injectable, inject, computed } from '@angular/core';
import { StateBase } from '@sports-iq/libs';
import { GamesService, Game } from '../services/games.service';
import { UserStateService } from './user-state.service';
import { catchError, of } from 'rxjs';

interface GamesState {
  games: Game[];
  selectedGame: Game | null;
  loading: boolean;
  error: string | null;
}

const initialState: GamesState = {
  games: [],
  selectedGame: null,
  loading: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class GamesStateService extends StateBase<GamesState> {
  private gamesService = inject(GamesService);
  private userState = inject(UserStateService);

  // Computed signals
  public upcomingCount = computed<number>(() => this.state().games.length);

  public hasGames = computed<boolean>(() => this.state().games.length > 0);

  constructor() {
    super(initialState);

    // Auto-load games when user authenticates
    this.userState.state$.subscribe((userState) => {
      if (userState.isAuthenticated && userState.loaded) {
        this.loadUpcomingGames();
      }
    });
  }

  /**
   * Load upcoming games from API
   */
  public loadUpcomingGames(): void {
    this.patchState({ loading: true, error: null });

    this.gamesService
      .getUpcomingGames()
      .pipe(
        catchError((error) => {
          this.patchState({
            loading: false,
            error: error?.message || 'Failed to load games',
          });
          return of([]);
        }),
      )
      .subscribe((games) => {
        this.patchState({
          games,
          loading: false,
          error: null,
        });
      });
  }

  /**
   * Get a specific game by ID
   */
  public selectGame(id: number): void {
    this.patchState({ loading: true, error: null });

    this.gamesService
      .getGameById(id)
      .pipe(
        catchError((error) => {
          this.patchState({
            loading: false,
            error: error?.message || 'Failed to load game',
          });
          return of(null);
        }),
      )
      .subscribe((game) => {
        this.patchState({
          selectedGame: game,
          loading: false,
        });
      });
  }

  /**
   * Save a game (create or update)
   */
  public saveGame(game: Game): void {
    this.patchState({ loading: true, error: null });

    this.gamesService
      .saveGame(game)
      .pipe(
        catchError((error) => {
          this.patchState({
            loading: false,
            error: error?.message || 'Failed to save game',
          });
          return of(null);
        }),
      )
      .subscribe((saved) => {
        if (saved) {
          // Reload games
          this.loadUpcomingGames();
        }
      });
  }

  /**
   * Delete a game
   */
  public deleteGame(id: number): void {
    this.patchState({ loading: true, error: null });

    this.gamesService
      .deleteGame(id)
      .pipe(
        catchError((error) => {
          this.patchState({
            loading: false,
            error: error?.message || 'Failed to delete game',
          });
          return of(undefined);
        }),
      )
      .subscribe(() => {
        this.loadUpcomingGames();
      });
  }

  /**
   * Refresh the games list
   */
  public refresh(): void {
    this.loadUpcomingGames();
  }
}
```

### Example 4: Component Using State Service

```typescript
// src/app/pages/games/games.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesStateService } from '../../state/games-state.service';
import { Game } from '../../services/games.service';

@Component({
  selector: 'app-games',
  imports: [CommonModule],
  template: `
    <h1>Upcoming Games</h1>

    @if (isLoading()) {
      <p class="loading">Loading games...</p>
    } @else if (hasError()) {
      <div class="error">
        <p>{{ hasError() }}</p>
        <button (click)="refresh()">Try Again</button>
      </div>
    } @else if (hasGames()) {
      <div class="games-list">
        @for (game of games(); track game.id) {
          <div class="game-card">
            <h3>{{ game.homeTeam }} vs {{ game.awayTeam }}</h3>
            <p>{{ game.date | date: 'short' }}</p>
            @if (game.score) {
              <p class="score">{{ game.score }}</p>
            }
            <button (click)="selectGame(game.id)">View Details</button>
          </div>
        }
      </div>
    } @else {
      <p>No upcoming games</p>
    }
  `,
})
export class Games implements OnInit {
  private gamesState = inject(GamesStateService);

  // Expose state to template
  games = () => this.gamesState.state().games;
  isLoading = () => this.gamesState.state().loading;
  hasError = () => this.gamesState.state().error;
  hasGames = this.gamesState.hasGames;

  ngOnInit() {
    // Games are loaded automatically when user authenticates
    // But you can manually refresh if needed
    this.gamesState.loadUpcomingGames();
  }

  selectGame(id: number) {
    this.gamesState.selectGame(id);
  }

  refresh() {
    this.gamesState.loadUpcomingGames();
  }
}
```

## Common Patterns

### Pattern 1: Fetch on Component Init (Authenticated Users Only)

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { UserStateService } from '../../state/user-state.service';

@Component({...})
export class MyComponent implements OnInit {
  private userState = inject(UserStateService);
  private myService = inject(MyService);

  ngOnInit() {
    if (this.userState.state().isAuthenticated) {
      this.loadData();
    }
  }

  loadData() {
    // Load data from API
  }
}
```

### Pattern 2: Conditional Rendering Based on Auth

```typescript
// In template
@if (userState.state().isAuthenticated && !userState.state().loading) {
  <!-- Show user-specific data -->
  <app-dashboard [user]="userState.state().account" />
} @else if (userState.state().loading) {
  <p>Loading...</p>
} @else {
  <!-- Show login prompt -->
  <app-login />
}
```

### Pattern 3: Retry Failed Requests

```typescript
public retry(): void {
  this.loadData();
}

// In template
@if (hasError()) {
  <div class="error">
    {{ hasError() }}
    <button (click)="retry()">Retry</button>
  </div>
}
```

## Best Practices

1. **Check Authentication Before Fetching**

   - Always verify `isAuthenticated` is true before making API calls
   - The `UserStateService` does this automatically for account data

2. **Handle Loading States**

   - Show loading indicators while fetching
   - Prevent multiple simultaneous requests for same data

3. **Handle Errors Gracefully**

   - Store error messages in state
   - Provide retry mechanisms
   - Show user-friendly error messages

4. **Separate Concerns**

   - Services handle API communication (extending `HttpBase`)
   - State services handle data management (extending `StateBase`)
   - Components consume state via signals

5. **Use Computed Signals**

   - Derive values from state rather than storing duplicates
   - Memoized and efficient

6. **Type Everything**
   - Define interfaces for all API responses
   - Leverage TypeScript for safety

## API Request Flow

```
Component
    ↓ (injects service)
UserStateService / GamesStateService (extends StateBase)
    ↓ (calls)
GamesService / AccountService (extends HttpBase)
    ↓ (makes request)
HttpClient
    ↓ (Auth0 interceptor adds token)
API
    ↓ (returns data)
Observable<T>
    ↓ (updates state)
StateBase.patchState()
    ↓ (signals update)
Component re-renders with new data
```

## Troubleshooting

### Data not loading after login?

Check:

- Is `isAuthenticated` true in state?
- Is the API endpoint correct? (Check URL in `HttpBase`)
- Does the API return the expected data structure?
- Are there any console errors?

### Getting 401 Unauthorized?

- Auth0 token may have expired
- Token not being sent with request (check `authHttpInterceptorFn` in `app.config.ts`)
- API expects different auth header format

### Duplicate API requests?

- Multiple components subscribing to same data
- Solution: Share data through state service (already done for account data)

### State not updating in template?

- Make sure you're calling signals: `data()` not `data`
- Use computed signals for derived values
- Check that component is marked for change detection

## Next Steps

1. Create services for your different API endpoints (following `AccountService` pattern)
2. Create state services for complex data (following `GamesStateService` example)
3. Use these in your components with proper error/loading handling
4. Test that data loads when user authenticates

-- This file contains SQL statements that will be executed after the build script.

-- Seed data for Core.TransactionTypes
INSERT INTO Core.TransactionTypes (TransactionTypeId, Name, Description)
VALUES
    (1, 'Draft', 'Player acquired via draft'),
    (2, 'Auction', 'Player acquired via auction'),
    (3, 'Trade', 'Player traded between teams'),
    (4, 'Waiver', 'Player acquired via waiver'),
    (5, 'Release', 'Player released from team'),
    (6, 'Add', 'Player added to team (no waiver required)');

-- Seed data for Player.PlayerStatus
INSERT INTO [dbo].[Player.PlayerStatus] ([Name], [Description], [IsILEligible]) 
VALUES
    ('Active', 'Player is currently active and eligible to play.', 0),
    ('Injured', 'Player is injured and not eligible to play.', 1),
    ('Suspended', 'Player is suspended due to disciplinary reasons.', 0),
    ('Retired', 'Player has retired from professional play.', 0),
    ('Inactive', 'Player is not currently active for other reasons.', 0),
    ('On Loan', 'Player is temporarily playing for another team.', 1);
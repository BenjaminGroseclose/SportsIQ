

SELECT * FROM Player.Players WHERE LastName = 'Rodgers'

SELECT * FROM Player.Contracts WHERE PlayerID = 2

SELECT 
    cy.* 
FROM 
    Player.Contracts c
    JOIN Player.ContractYears cy ON c.ContractID = cy.ContractID
WHERE c.PlayerID = 2
ORDER BY [Year] ASC;

SELECT * FROM Player.Players WHERE PlayerID = 207

SELECT 
    p.PlayerID
    ,p.PlayerName
    ,pr.SportsIQRating
    ,pr.RawScore
    ,pr.ConfidenceScore
FROM
    Player.PlayerRatings pr 
    JOIN Player.Players p ON pr.PlayerID = p.PlayerID
WHERE
    p.[Position] = 'QB'
    AND pr.Season = 2025
ORDER BY
    pr.SportsIQRating DESC;


SELECT
    c.ContractID
    ,p.PlayerID
    ,p.PlayerName
FROM
    Player.Contracts c 
    JOIN player.Players p ON c.PlayerID = p.PlayerID
WHERE
    EXISTS (
        SELECT 1
        FROM Player.ContractYears cy
        WHERE cy.ContractID = c.ContractID
    );
package com.sportsiq.data.queries

class BaseQuery {
    companion object {
        const val MLB_PITCHING = """
SELECT 
    p.FirstName + ' ' + p.LastName AS [Name]
    ,t.Abbreviation AS [Team]
    ,p.PositionCategory
    ,p.[Position]
    ,pit.*
FROM
    MLB.Pitching pit 
    JOIN MLB.Players p ON p.PlayerID = pit.PlayerID
    JOIN MLB.Teams t ON t.TeamID = pit.TeamID
"""

        const val MLB_BATTING = """
SELECT 
    p.FirstName + ' ' + p.LastName AS [Name]
    ,t.Abbreviation AS [Team]
    ,p.PositionCategory
    ,p.[Position]
    ,b.*
FROM
    MLB.Batting b 
    JOIN MLB.Players p ON p.PlayerID = b.PlayerID
    JOIN MLB.Teams t ON t.TeamID = b.TeamID
        """
    }
}
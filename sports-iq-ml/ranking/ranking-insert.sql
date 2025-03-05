

--SELECT * FROM dbo.MLB_Ranking WHERE Name = 'Jasson Domínguez'

--UPDATE dbo.MLB_Ranking SET Name = 'Jasson Domínguez'
--WHERE RK = 138

SELECT 
	p.PlayerID
	,mr.Elo
	,2024 AS [Season]
FROM 
	dbo.MLB_Ranking mr
	LEFT JOIN MLB.Players p 
		ON mr.Name = p.FirstName + ' ' + p.LastName
WHERE
	(mr.Name != 'Jose Ramirez' OR p.PlayerID = 4391)
	AND (mr.Name != 'Juan Soto' OR p.PlayerID = 5351)
	AND (mr.Name != 'Julio Rodriguez' OR p.PlayerID = 6010)
	AND (mr.Name != 'Edwin Diaz' OR p.PlayerID = 5079)
	AND (mr.Name != 'Luis Castillo' OR p.PlayerID = 5586)
	AND (mr.Name != 'Will Smith' OR p.PlayerID = 5526)
	AND (mr.Name != 'Max Muncy' OR p.PlayerID = 4754)
	AND (mr.Name != 'Jesus Sanchez' OR p.PlayerID = 4904)
	AND (mr.Name != 'Josh Bell' OR p.PlayerID = 4926)
	AND (mr.Name != 'Cade Smith' OR p.PlayerID = 7571)
	AND (mr.Name != 'Michael Massey' OR p.PlayerID = 6887)
	AND (mr.Name != 'Josh Smith' OR p.PlayerID = 6916)
	AND (mr.Name != 'Endy Rodriguez' OR p.PlayerID = 9266)
	AND (mr.Name != 'Luis Garcia' OR p.PlayerID = 4572)
	AND (mr.Name != 'Jacob Wilson' OR p.PlayerID = 10406)
	AND (mr.Name != 'Wilmer Flores' OR p.PlayerID = 4533)
	AND (mr.Name != 'Beau Brieske' OR p.PlayerID = 8600)
	AND (mr.Name != 'Juan Brito' OR p.PlayerID = 9514)
	AND (mr.Name != 'Luis Matos' OR p.PlayerID = 6425)
	AND (mr.Name != 'Albert Suarez' OR p.PlayerID = 4971)
	AND (mr.Name != 'Fernando Cruz' OR p.PlayerID = 5185)
	AND (mr.Name != 'Spencer Jones' OR p.PlayerID = 6624)
	AND (mr.Name != 'Jacob Webb' OR p.PlayerID = 6506)
	AND (mr.Name != 'Jose Lopez' OR p.PlayerID = 9534)
	AND (mr.Name != 'Manuel Rodriguez' OR p.PlayerID = 7116)
	AND mr.RK IN (559, 412)


SELECT * FROM MLB.Players WHERE LastName LIKE '%Rodriguez%' AND FirstName = 'Manuel' AND PositionCategory = 'P' --AND FirstName = 'Eury'
SELECT * FROM MLB.Players WHERE FirstName = 'Nestor'

--EXEC MLB.PlayerCleanUp


SELECT * FROM MLB.Players WHERE LastName = 'Witt Jr.'


-- Manually Update RK 559 to be PlayerID 6149
-- Manually Update RK 412 to be PlayerID 4887


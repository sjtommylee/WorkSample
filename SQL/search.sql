USE [C89_AirPals]
GO
/****** Object:  StoredProcedure [dbo].[Orders_Search_ByStatusId]    Script Date: 9/7/2020 9:54:09 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[Orders_Search_ByStatusId]
				@pageIndex INT,
				@pageSize INT,
				@Query NVARCHAR(100)

/*******************TEST**********************

DECLARE @pageIndex INT = 0,
		@pageSize INT = 20,
		@Query NVARCHAR(100) = 6

EXECUTE dbo.Orders_Search_ByStatusId @pageIndex, @pageSize, @Query

SELECT * FROM dbo.OrderStatus

**********************************************/


AS



BEGIN

	Declare @offset int = @PageIndex * @PageSize

	SELECT	o.Id,
			o.ShipmentId,
			PickUp = (
			
			SELECT	pu.Firstname,
					pu.LastName,
					pu.Email,
					pu.Phone,
					Location.LineOne,
					Location.LineTwo,
					Location.City,
					Location.Zip,
					State = (
					SELECT st.Code
					FROM dbo.States as st
					WHERE Location.StateId = st.Id
					)
			FROM	dbo.Pickups as pu,
					dbo.Locations as Location

			WHERE o.ShipmentId = s.Id
			AND pu.Id = s.PickupId
			AND pu.LocationId = Location.Id
			
			FOR JSON PATH, WITHOUT_ARRAY_WRAPPER

			),
			s.DropOffId,
			DropOff = (
			
			SELECT	Contact = (
					SELECT	c.FirstName,
							c.LastName,
							c.Email,
							c.Phone
					FROM	dbo.Contacts as c
					WHERE do.ContactId = c.Id
					FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
					),
					ShippingAddress = (
					SELECT	l.LineOne,
							l.LineTwo,
							l.City,
							l.Zip,
							State = (
							SELECT st.Code
							FROM dbo.States as st
							WHERE l.StateId = st.Id
							)
					FROM	dbo.locations as l
					WHERE do.LocationId = l.Id
					FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
					)
					
				FROM dbo.DropOffs as do
				WHERE s.DropOffId = do.Id
				FOR JSON PATH, WITHOUT_ARRAY_WRAPPER

				),
				o.StatusId,
				Messenger = (
				SELECT	m.FirstName,
						m.LastName,
						m.Phone,
						m.AvatarUrl
				FROM dbo.Messengers as m
				WHERE o.MessengerId = m.Id
				FOR JSON PATH, WITHOUT_ARRAY_WRAPPER

				),
				o.TrackingCode,
				o.TrackingUrl,
				o.ChargeId,
				o.PaymentAccountId,
				o.DateCreated,
				o.DateModified,
				o.CreatedBy,
				o.ModifiedBy,

				totalCount = COUNT(1)OVER()

			

	FROM	dbo.Orders as o
	INNER JOIN dbo.Shipments as s
	on o.ShipmentId = s.Id
	AND (
		o.StatusId LIKE '%' + @Query + '%'
	)
	ORDER BY DateCreated DESC
	OFFSET @offSet Rows
	Fetch Next @pageSize Rows ONLY


END
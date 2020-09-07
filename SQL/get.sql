USE [C89_AirPals]
GO
/****** Object:  StoredProcedure [dbo].[Orders_Select_Details_byId_V3]    Script Date: 9/7/2020 9:52:07 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[Orders_Select_Details_byId_V3]
				@Id int 

/*************************TEST**************************

DECLARE @Id int = 5

EXECUTE dbo.Orders_Select_Details_byId_V3
					@Id


*******************************************************/

AS


BEGIN



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
			PickUpDate = (
							SELECT	pu.PickupDate
							FROM	dbo.Pickups as pu
							WHERE	o.ShipmentId = s.Id
							AND		s.PickupId = pu.Id

						),
			s.DropOffId,
			DropOff = (
			
							SELECT	Contact =	(
													SELECT	c.FirstName,
															c.LastName,
															c.Email,
															c.Phone
													FROM	dbo.Contacts as c
													WHERE do.ContactId = c.Id
													FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
												),
									ShippingAddress =	(
															SELECT	l.LineOne,
																	l.LineTwo,
																	l.City,
																	l.Zip,
																	State = (
																				SELECT	st.Code
																				FROM	dbo.States as st
																				WHERE	l.StateId = st.Id
																			)
															FROM	dbo.locations as l
															WHERE do.LocationId = l.Id
															FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
														)
					
							FROM dbo.DropOffs as do
							WHERE s.DropOffId = do.Id
							FOR JSON PATH, WITHOUT_ARRAY_WRAPPER

				),
			DropOffDate =	(
								SELECT do.DropOffDate
								FROM dbo.DropOffs as do
								WHERE o.ShipmentId = s.Id
								AND	s.DropOffId = do.Id
							),
			o.StatusId,
			o.MessengerId,
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
			StatusLog = (
							Select	os.Id as [id],
									os.Name as [name],
									los.ModifiedBy as [modifiedBy],
									los.DateModified as [dateModified]
							from	dbo.LogOrderStatus as los INNER JOIN dbo.OrderStatus as os
							on		los.StatusId = os.Id
							WHERE	los.OrderId = @Id
							FOR JSON PATH
						)

			

	FROM	dbo.Orders as o
	INNER JOIN dbo.Shipments as s
	on o.ShipmentId = s.Id
	WHERE @Id = o.Id
END
USE [C89_AirPals]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[PaymentTransactions_Insert]
				@Id INT OUTPUT,
				@RecipientAccountId NVARCHAR(255),
				@SenderAccountId NVARCHAR(255),
				@RecipientId INT,
				@SenderId INT,
				@Amount DECIMAL(10,2),
				@TransactionToken NVARCHAR(255)
				
/**********************TEST**************************

DECLARE			@Id INT = 0;


DECLARE			@RecipientAccountId NVARCHAR(255) = 'pk_test_51HBqVzIm69mmUK7rA54EQOaeLHNwBUVdR6ya',
				@SenderAccountId NVARCHAR(255) = 'cus_HmlwRTBeOwgpV6',
				@RecipientId INT = 5,
				@SenderId INT = 99,
				@Amount DECIMAL(10,2) = 10.99,
				@TransactionToken NVARCHAR(255) = 'pi_1HBrQ9Im69mmUK7rWLaYhFIh'
				
EXECUTE dbo.PaymentTransactions_Insert
				@Id OUT,
				@RecipientAccountId,
				@SenderAccountId,
				@RecipientId,
				@SenderId,
				@Amount,
				@TransactionToken

SELECT * FROM dbo.PaymentTransactions
				SELECT * FROM dbo.Users

SELECT * FROM PaymentType_V2
SELECT * FROM PaymentStatus

****************************************************/



AS



BEGIN

	INSERT INTO dbo.PaymentTransactions
				(
				RecipientAccountId,
				SenderAccountId,
				RecipientId,
				SenderId,
				Amount,
				TransactionToken
				)

	VALUES		(
				@RecipientAccountId,
				@SenderAccountId,
				@RecipientId,
				@SenderId,
				@Amount,
				@TransactionToken
				)

	SELECT	@Id = SCOPE_IDENTITY()
	


END
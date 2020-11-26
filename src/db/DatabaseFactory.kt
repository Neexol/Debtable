package ru.neexol.debtable.db

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import db.tables.Purchases
import db.tables.Rooms
import db.tables.Users
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import ru.neexol.debtable.db.tables.DebtorsPurchases
import ru.neexol.debtable.db.tables.UsersRooms

object DatabaseFactory {
    fun init() {
        Database.connect(hikari())

        transaction {
            with(SchemaUtils) {
                create(Users)
                create(Rooms)
                create(Purchases)
                create(UsersRooms)
                create(DebtorsPurchases)
            }
        }
    }

    private fun hikari(): HikariDataSource {
        val config = HikariConfig()
        config.driverClassName = System.getenv("JDBC_DRIVER")
        config.jdbcUrl = System.getenv("JDBC_DATABASE_URL")
        config.maximumPoolSize = 3
        config.isAutoCommit = false
        config.transactionIsolation = "TRANSACTION_REPEATABLE_READ"

        config.validate()
        return HikariDataSource(config)
    }
}
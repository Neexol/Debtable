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
        val config = HikariConfig().apply {
            jdbcUrl = System.getenv("JDBC_DATABASE_URL")
            maximumPoolSize = 3
            isAutoCommit = false
            transactionIsolation = "TRANSACTION_REPEATABLE_READ"
            validate()
        }
        return HikariDataSource(config)
    }
}
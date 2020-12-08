package ru.neexol.debtable.models.responses

import com.google.gson.annotations.SerializedName
import org.jetbrains.exposed.sql.transactions.transaction
import ru.neexol.debtable.db.entities.Purchase

data class PurchaseResponse(
    @SerializedName("name") val name: String,
    @SerializedName("debt") val debt: Float,
    @SerializedName("date") val date: String,
    @SerializedName("buyer") val buyer: UserResponse,
    @SerializedName("debtors") val debtors: List<UserResponse>
) {
    constructor(purchase: Purchase) : this(
        purchase.name,
        purchase.debt,
        purchase.date,
        UserResponse(transaction { purchase.buyer }),
        transaction { purchase.debtors.map { UserResponse(it) } },
    )

    companion object {
        val example = mapOf(
            "name" to "Milk",
            "debt" to 33.3,
            "date" to "22.09.2000",
            "buyer" to UserResponse.example,
            "debtors" to listOf(UserResponse.example, UserResponse.example, UserResponse.example)
        )
    }
}
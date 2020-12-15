package ru.neexol.debtable.models.responses

import com.google.gson.annotations.SerializedName
import org.jetbrains.exposed.sql.transactions.transaction
import ru.neexol.debtable.db.entities.Purchase

data class PurchaseResponse(
    @SerializedName("id") val id: Int,
    @SerializedName("name") val name: String,
    @SerializedName("debt") val debt: Float,
    @SerializedName("cost") val cost: Float,
    @SerializedName("date") val date: String,
    @SerializedName("buyer") val buyer: UserResponse,
    @SerializedName("debtors") val debtors: List<UserResponse>
) {
    constructor(purchase: Purchase) : this(
        purchase.id.value,
        purchase.name,
        purchase.debt,
        purchase.debt * transaction { purchase.debtors.count() },
        purchase.date,
        UserResponse(transaction { purchase.buyer }),
        transaction { purchase.debtors.map { UserResponse(it) } },
    )

    companion object {
        val EXAMPLES = listOf(
            mapOf(
                "id" to 1,
                "name" to "Milk",
                "debt" to 40,
                "date" to "22.09.2020",
                "buyer" to UserResponse.EXAMPLES[0],
                "debtors" to listOf(UserResponse.EXAMPLES[0], UserResponse.EXAMPLES[1])
            ),
            mapOf(
                "id" to 2,
                "name" to "Meat",
                "debt" to 120,
                "date" to "24.12.2020",
                "buyer" to UserResponse.EXAMPLES[1],
                "debtors" to listOf(UserResponse.EXAMPLES[1], UserResponse.EXAMPLES[2])
            ),
            mapOf(
                "id" to 3,
                "name" to "Water",
                "debt" to 15,
                "date" to "15.06.2020",
                "buyer" to UserResponse.EXAMPLES[2],
                "debtors" to listOf(UserResponse.EXAMPLES[0])
            )
        )
    }
}
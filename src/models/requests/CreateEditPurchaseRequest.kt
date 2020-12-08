package ru.neexol.debtable.models.requests

import com.google.gson.annotations.SerializedName

data class CreateEditPurchaseRequest(
    @SerializedName("name") val name: String,
    @SerializedName("debt") val debt: Float,
    @SerializedName("date") val date: String,
    @SerializedName("buyer_id") val buyerId: Int,
    @SerializedName("debtor_ids") val debtorIds: List<Int>
) {
    companion object {
        val EXAMPLE = mapOf(
            "name" to "Milk",
            "debt" to "99",
            "date" to "22.09.2000",
            "buyer_id" to 1,
            "debtor_ids" to listOf(1, 2, 3)
        )
    }
}
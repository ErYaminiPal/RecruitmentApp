package net.marsbytes.app.recruitment.domain;

import static org.assertj.core.api.Assertions.assertThat;

import net.marsbytes.app.recruitment.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class JobCategoriesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(JobCategories.class);
        JobCategories jobCategories1 = new JobCategories();
        jobCategories1.setId(1L);
        JobCategories jobCategories2 = new JobCategories();
        jobCategories2.setId(jobCategories1.getId());
        assertThat(jobCategories1).isEqualTo(jobCategories2);
        jobCategories2.setId(2L);
        assertThat(jobCategories1).isNotEqualTo(jobCategories2);
        jobCategories1.setId(null);
        assertThat(jobCategories1).isNotEqualTo(jobCategories2);
    }
}
